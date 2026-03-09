import * as tts from '../src/index';
let session: tts.TtsSession | null = null;

async function main(event: MessageEvent<tts.InferenceConfig & { type: 'init' | 'voices' | 'error' | 'stored' | 'flush' }>) {
  if (event.data.type === 'voices') {
    self.postMessage({ type: 'voices', voices: await tts.voices() })
    return;
  }

  if (event.data.type === 'stored') {
    self.postMessage({ type: 'stored', voiceIds: await tts.stored() })
    return;
  }

  if (event.data.type === 'flush') {
    await tts.flush();
    return;
  }

  if (event.data?.type != 'init') return;
  try {
    if (!session)
      session = new tts.TtsSession({
        voiceId: event.data.voiceId,
        progress: (e) => self.postMessage(JSON.stringify(e)),
        logger: (msg: string) => self.postMessage(msg),
        // If commented out will fetch from remote CDN URLs.
        // wasmPaths: {
        //   onnxWasm: tts.TtsSession.WASM_LOCATIONS.onnxWasm,
        //   piperData: '/assets/piper_phonemize.data',
        //   piperWasm: '/assets/piper_phonemize.wasm',
        // }
      });

    if (!!event.data.voiceId && session.voiceId !== event.data.voiceId) {
      console.log("Voice changed - reinitializing");
      const previousVoiceId = session.voiceId;
      session.voiceId = event.data.voiceId;
      try {
        await session.init();
      } catch (error) {
        session.voiceId = previousVoiceId;
        throw error;
      }
    }

    const res = await session.predict(event.data.text);
    if (res instanceof Blob) {
      self.postMessage({ type: 'result', audio: res });
    }
  } catch (error: any) {
    session = null;
    (tts.TtsSession as any)._instance = null;
    self.postMessage({ type: 'error', message: error?.message || 'Unknown error', error });
  }
}

self.addEventListener('message', main);
