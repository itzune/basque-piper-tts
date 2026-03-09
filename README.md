# Basque Piper TTS

<p align="center">
  <img src="https://avatars.githubusercontent.com/u/185958299?s=400&u=ed950f6733b82e4ab46c02cc7b454bfcb3b43bc2&v=4" alt="Itzune" width="120" />
</p>

<p align="center">
  <a href="https://github.com/itzune">Itzune on GitHub</a> ·
  <a href="https://huggingface.co/itzune">Itzune on Hugging Face</a> ·
  <a href="https://itzune.github.io/basque-piper-tts/">Live demo</a>
</p>

This project aims to provide a demo for the [Basque Piper TTS project](https://huggingface.co/collections/itzune/tts), which currently includes two voice models hosted on Hugging Face. Both are based on voices from the [HiTZ (Aholab) TTS work](https://huggingface.co/collections/HiTZ/tts).

Piper is a lightweight TTS engine designed to run with low resources. That makes it possible to generate audio directly in the browser, preserving data privacy because text never leaves the device.

## Voices

- **Maider (female)**
  - Voice model: https://huggingface.co/itzune/maider-tts
  - Dataset: https://huggingface.co/datasets/itzune/maider-dataset
- **Antton (male, work in progress)**
  - Voice model: https://huggingface.co/itzune/antton-tts
  - Dataset: https://huggingface.co/datasets/itzune/antton-dataset

## Features

- Basque-first demo experience with editable text and audio playback.
- Model download progress and generation indicators.
- Audio export after synthesis.

## Demo

Live demo: https://itzune.github.io/basque-piper-tts/

## References

- Piper project: https://github.com/rhasspy/piper
- HiTZ Aholab TTS source model: https://huggingface.co/HiTZ/TTS-eu_maider
- Base web project: https://github.com/Mintplex-Labs/piper-tts-web
