import { Response, Request } from 'express';
import OpenAI from 'openai';
import { createAssistant } from '../openai/createAssistant';
import { createThread } from '../openai/createThread';
import { performRun } from '../openai/performRunDev';
import { createRun } from '../openai/createRun';
import TransferQueryService from './db';
import { parseQueryOptions } from '../types';
import { validateAccount } from '../utils/validateAddress';

export async function runCommand(req: Request, res: Response) {
  const options = parseQueryOptions(req.body);
  const { userMessage } = req.body;

  if (!userMessage || typeof userMessage !== 'string' || userMessage.trim() === '') {
    return res.status(400).json({
      success: false,
      message: "userMessage field is required and cannot be empty",
    });
  }

  try {
    const client = new OpenAI();
    const assistant = await createAssistant(client);
    const thread = await createThread(client, userMessage);
    const run = await createRun(client, thread, assistant.id);

    const toolCalls = run.required_action?.submit_tool_outputs?.tool_calls;

    // ── Path A: AI returned a function call ──────────────────────────────────
    if (toolCalls && Array.isArray(toolCalls) && toolCalls.length > 0) {
      const functionCalls = toolCalls.filter((c) => c.type === 'function');

      if (functionCalls.length > 0) {
        // Parse all function call arguments
        const parsedCalls = functionCalls.map((call) => {
          try {
            return {
              id: call.id,
              functionName: call.function?.name,
              arguments: JSON.parse(call.function?.arguments || '{}'),
            };
          } catch {
            return { id: call.id, functionName: call.function?.name, arguments: {} };
          }
        });

        // Submit dummy tool outputs so the run can be cancelled cleanly
        await client.beta.threads.runs.submitToolOutputs(thread.id, run.id, {
          tool_outputs: parsedCalls.map((c) => ({
            tool_call_id: c.id,
            output: JSON.stringify({ success: true }),
          })),
        });

        try {
          await client.beta.threads.runs.cancel(thread.id, run.id);
        } catch {
          // Cancel may fail if run already completed — that's fine
        }

        // Extract address and requested fields from the first function call
        const args = parsedCalls[0].arguments as Record<string, any>;
        const address: string | undefined =
          args.address || args.token_address || args.tokenAddress;

        const requestedFields: string[] = normaliseFields(
          args.fields ?? args.returnFields ?? args.include
        );

        if (!address) {
          return res.status(400).json({
            success: false,
            message: 'Address query detected but no valid address found in AI response',
            queryType: 'address',
          });
        }

        if (!validateAccount(address)) {
          return res.status(400).json({
            success: false,
            message: `Invalid Ethereum address: ${address}`,
            queryType: 'address',
          });
        }

        let transfers = await TransferQueryService.getTransfersByToken(address, options);

        if (!transfers || transfers.length === 0) {
          return res.status(404).json({
            success: false,
            message: `No records found for address ${address}`,
            queryType: 'address',
          });
        }

        if (requestedFields.length > 0) {
          transfers = transfers.map((t: any) => {
            const filtered: Record<string, any> = { id: t.id };
            requestedFields.forEach((field) => {
              if (field in t) filtered[field] = t[field];
            });
            return filtered;
          });
        }

        const apiEndpoint = `${process.env.BASE_URL}/api/baseindex/${address}`;
        return res.status(200).json({
          success: true,
          message: 'Address query processed successfully',
          data: transfers,
          queryType: 'address',
          endPoint: apiEndpoint,
          fields: requestedFields.length > 0 ? requestedFields : 'all',
        });
      }
    }

    // ── Path B: AI returned a plain text message ──────────────────────────────
    const messageContent = await performRun(client, thread, run);
    let informationalResponse: string | undefined;

    if (
      messageContent &&
      'text' in messageContent &&
      typeof (messageContent as any).text?.value === 'string'
    ) {
      const raw = (messageContent as any).text.value as string;

      // Try to parse as JSON (some prompts return structured JSON)
      try {
        const parsed = JSON.parse(raw);
        if (parsed.addresses && Array.isArray(parsed.addresses) && parsed.addresses[0]) {
          const address = parsed.addresses[0] as string;
          if (!validateAccount(address)) {
            return res.status(400).json({
              success: false,
              message: `Invalid Ethereum address: ${address}`,
              queryType: 'address',
            });
          }
          const transfers = await TransferQueryService.getTransfersByToken(address, options);
          return res.status(200).json({
            success: true,
            message: 'Address query processed successfully',
            data: transfers,
            queryType: 'address',
            endPoint: `${process.env.BASE_URL}/api/baseindex/${address}`,
            fields: 'all',
          });
        }
      } catch {
        // Not JSON — treat as informational text
        informationalResponse = raw;
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Informational query processed successfully',
      data: { response: informationalResponse ?? 'No response from assistant' },
      queryType: 'informational',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message || 'Unknown error',
    });
  }
}

/** Normalise fields argument which may be an array, comma-separated string, or undefined */
function normaliseFields(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === 'string') return raw.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
}
