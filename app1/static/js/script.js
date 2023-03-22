// tonejsライブラリのインポート
import * as Tone from "https://cdn.skypack.dev/tone";

// DOM取得 ボタン
const playBtn = document.getElementById("play-btn");
const stopBtn = document.getElementById("stop-btn");
const loopBtn = document.getElementById("loop-btn");
const clearBtnDrum = document.getElementById("clear-btn-drum");
const clearBtnPiano = document.getElementById("clear-btn-piano");
const buttons = document.querySelectorAll("button");

// DOM取得　BPM
const bpmSlider = document.getElementById("slider");
const target = document.getElementById("value");

// DOM取得　ドラム音色
const instKick = document.getElementById("inst-kick");
const instSnare = document.getElementById("inst-snare");
const instClap = document.getElementById("inst-clap");
const instHihat = document.getElementById("inst-hat-closed");

// DOM取得　ドラムシーケンサ
const drumLed = document.getElementById("LEDStep").children;
const kickSeq = document.getElementById("kick").children;
const snareSeq = document.getElementById("snare").children;
const clapSeq = document.getElementById("clap").children;
const closedHatSeq = document.getElementById("closedHat").children;

// DOM取得　ピアノ音色
const c = document.getElementById("note-C");
const d = document.getElementById("note-D");
const e = document.getElementById("note-E");
const f = document.getElementById("note-F");
const g = document.getElementById("note-G");
const a = document.getElementById("note-A");
const b = document.getElementById("note-B");

// DOM取得　ピアノシーケンサ
const pianoLed = document.getElementById("LED-step-piano").children;

// ピアノシーケンスの状態を管理する２次元配列生成の関数
const makePianoGrid = () => {
  let grid = [];
  for (let i = 0; i < 7; i++) {
    let row = [];
    for (let j = 0; j < 16; j++) {
      row.push(false);
    }
    grid.push(row);
  }
  return grid;
};

// ２次元配列生成
let grid = makePianoGrid();

// 音色の設定(ドラム)
const kick = new Tone.MembraneSynth().toDestination();
const snare = new Tone.NoiseSynth({
  noise: {
    type: "pink",
    playbackRate: 3,
    fadeIn: 0.001,
    fadeOut: 0.2,
  },
  envelope: {
    attack: 0.001,
    decay: 0.15,
    sustain: 0,
    release: 0.05,
  },
}).toDestination();
const clap = new Tone.NoiseSynth({
  noise: {
    type: "white",
    playbackRate: 3,
    fadeIn: 0.001,
    fadeOut: 0.2,
  },
  envelope: {
    attack: 0.001,
    decay: 0.05,
    sustain: 0,
    release: 0.05,
  },
}).toDestination();
const hihat = new Tone.NoiseSynth({
  noise: {
    type: "white",
    playbackRate: 3,
    fadeIn: 0.001,
    fadeOut: 0.2,
  },
  envelope: {
    attack: 0.001,
    decay: 0.1,
    sustain: 0,
    release: 0.05,
  },
}).toDestination();

// 音色の設定(ピアノ)
const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];
let synth;
const synths = [];
const makeSynths = (num) => {
  for (let i = 0; i < num; i++) {
    synth = new Tone.Synth().toDestination();
    synths.push(synth);
  }
};

// シンセ生成
makeSynths(7);

// 必要な変数の宣言
let audioInitialised = false;
let isLoopMode = true;
let index = 0;

// LEDステップの初期化
drumLed[0].style = "background: red";
pianoLed[0].style = "background: red";

// BPM設定
Tone.Transport.bpm.value = 90;
bpmSlider.addEventListener("input", () => {
  target.innerHTML = bpmSlider.value + "bpm";
  Tone.Transport.bpm.value = bpmSlider.value;
});

// ドラム音のプレビュー
instKick.addEventListener("click", () => {
  kick.triggerAttackRelease("C2", "8n");
});

instSnare.addEventListener("click", () => {
  snare.triggerAttackRelease("8n");
});

instClap.addEventListener("click", () => {
  clap.triggerAttackRelease("8n");
});

instHihat.addEventListener("click", () => {
  hihat.triggerAttackRelease("8n");
});

// ピアノ音色プレビュー
c.addEventListener("click", () => {
  synths[0].triggerAttackRelease(notes[0], 0.6);
});

d.addEventListener("click", () => {
  synths[1].triggerAttackRelease(notes[1], 0.6);
});

e.addEventListener("click", () => {
  synths[2].triggerAttackRelease(notes[2], 0.6);
});

f.addEventListener("click", () => {
  synths[3].triggerAttackRelease(notes[3], 0.6);
});

g.addEventListener("click", () => {
  synths[4].triggerAttackRelease(notes[4], 0.6);
});

a.addEventListener("click", () => {
  synths[5].triggerAttackRelease(notes[5], 0.6);
});

b.addEventListener("click", () => {
  synths[6].triggerAttackRelease(notes[6], 0.6);
});

// PLAYボタンが押された時の挙動
playBtn.addEventListener("click", (e) => {
  if (!audioInitialised) {
    Tone.start();
    audioInitialised = true;
  }
  // シーケンスの最初のノートからループを開始
  index = 0;
  Tone.Transport.start();
  loop.start(0);
  playBtn.style.color = "#35ffb5";
  stopBtn.style.color = "white";
});

// STOPボタンが押された時の挙動
stopBtn.addEventListener("click", () => {
  index = 0;
  Tone.Transport.stop();
  loop.stop();
  playBtn.style.color = "white";
  stopBtn.style.color = "#35ffb5";
});

// LOOPボタンが押された時の挙動
loopBtn.addEventListener("click", () => {
  if (isLoopMode) {
    isLoopMode = false;
    loopBtn.style.color = "white";
  } else {
    isLoopMode = true;
    loopBtn.style.color = "#35ffb5";
  }
});

const resetLedAndStop = () => {
  index = 0;
  Tone.Transport.stop();
  loop.stop();
  for (let i = 0; i < 16; i++) {
    drumLed[i].style.background = "#e1fdf3";
    pianoLed[i].style.background = "#e1fdf3";
  }
  drumLed[0].style = "background: red";
  pianoLed[0].style = "background: red";
};

// CLEARボタン(drum)が押された時の挙動
clearBtnDrum.addEventListener("click", () => {
  for (let i = 0; i < 16; i++) {
    kickSeq[i].checked = false;
    snareSeq[i].checked = false;
    clapSeq[i].checked = false;
    closedHatSeq[i].checked = false;
  }
  resetLedAndStop();
});

// // CLEARボタン(piano)が押された時の挙動
// clearBtnPiano.addEventListener("click", () => {
//     grid.forEach((row) => {
//         row.forEach((index) => {
//             row[index] = false;
//         });
//     });
//     // buttons.forEach((button, index) => {
//     //     if (index / 16 === 0) button.style = "background: #f5f5f5";
//     //     if (index / 16 === 1) button.style = "background: #e6e8e9";
//     //     if (index / 16 === 2) button.style = "background: #d9d8e1";
//     //     if (index / 16 === 3) button.style = "background: #dcd5dc";
//     //     if (index / 16 === 4) button.style = "background: #e3e3e1";
//     //     if (index / 16 === 5) button.style = "background: #f0f0f0";
//     //     if (index / 16 === 6) button.style = "background: #d1d5d9";
//     // });

//     console.log(grid);
//     resetLedAndStop();
// });

// CLEARボタン(piano)が押された時の挙動
clearBtnPiano.addEventListener("click", () => {
  buttons.forEach((button) => {
    button.style = "background: #e6e8e9";
  });
  grid = makePianoGrid();
  resetLedAndStop();
  console.log(grid);
});

// ピアノシーケンスのボタンの状態管理(押されたらture/falseを反転)
buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const i = Math.floor(index / 16);
    const j = index % 16;
    grid[i][j] = !grid[i][j];
    if (grid[i][j]) {
      if (i === 0) button.style = "background: #c72e6c";
      if (i === 1) button.style = "background: #4ad4ef";
      if (i === 2) button.style = "background: #7367ef";
      if (i === 3) button.style = "background: #e36bd9";
      if (i === 4) button.style = "background: #efe267";
      if (i === 5) button.style = "background: #f2930b";
      if (i === 6) button.style = "background: #558acf";
      button.style.boxShadow = "0 0 5px 5px white";
    } else {
      if (i === 0) button.style = "background: #f5f5f5";
      if (i === 1) button.style = "background: #e6e8e9";
      if (i === 2) button.style = "background: #d9d8e1";
      if (i === 3) button.style = "background: #dcd5dc";
      if (i === 4) button.style = "background: #e3e3e1";
      if (i === 5) button.style = "background: #f0f0f0";
      if (i === 6) button.style = "background: #d1d5d9";
    }
  });
});

// LEDランプの管理
const lightingLed = (index) => {
  for (let i = 0; i < 16; i++) {
    drumLed[i].style.background = "#e1fdf3";
    pianoLed[i].style.background = "#e1fdf3";
  }
  drumLed[index].style.background = "red";
  pianoLed[index].style.background = "red";
};

// ドラム発音
const pronounceDrum = (index, time) => {
  if (kickSeq[index].checked) {
    kick.triggerAttackRelease("C2", "8n", time);
  }
  if (snareSeq[index].checked) {
    snare.triggerAttackRelease("8n", time);
  }
  if (clapSeq[index].checked) {
    clap.triggerAttackRelease("8n", time);
  }
  if (closedHatSeq[index].checked) {
    hihat.triggerAttackRelease("8n", time);
  }
};

// ピアノ発音
const pronouncePiano = (index) => {
  grid.forEach((row, i) => {
    let synth = synths[i];
    if (row[index]) {
      synth.triggerAttackRelease(notes[i], 0.5);
    }
  });
};

// シーケンサーのループ処理
const loop = new Tone.Loop((time) => {
  // LED点灯
  lightingLed(index);

  // ドラム発音
  pronounceDrum(index, time);

  // ピアノ発音
  pronouncePiano(index);

  // Loopモードでない場合、loopさせない
  if (!isLoopMode && index >= 15) {
    Tone.Transport.stop();
    loop.stop();
  }

  index++;
  index = index % 16;
}, "16n");
