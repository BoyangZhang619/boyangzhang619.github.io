/**
 * SimplePiano - 一个轻量级的 Web Audio API 钢琴引擎
 * * 使用方法:
 * const piano = new SimplePiano({ debug: true });
 * piano.play('C4');
 */
class SimplePiano {
    /**
     * @param {Object} options 配置项
     * @param {boolean} options.debug 是否开启调试日志 (默认 false)
     * @param {number} options.sustain 默认延音时长(秒) (默认 1.5)
     */
    constructor(options = {}) {
        this.debug = options.debug || false;
        this.defaultSustain = options.sustain || 1.5;
        this.oscType = options.oscType || 'triangle'; // 音色类型

        // 初始化 AudioContext (注意：浏览器通常要求用户交互后才能 resume)
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        // 存储当前正在播放的音符 (用于 startNote/stopNote)
        this.activeNotes = new Map();

        // 自动播放相关
        this.isPlaying = false;
        this.playTimeouts = [];
        this.onNotePlay = null; // 播放音符时的回调
        this.onSheetEnd = null; // 琴谱播放结束的回调

        // 预设琴谱 (休止符用 'R' 表示，和弦用数组表示如 [['C4','E4','G4'], 400])
        this.sheets = {
            // 带和弦伴奏的小星星 (左右手同时演奏)
            twinkleChord: {
                name: '小星星(和弦版)',
                notes: [
                    // 第一句: 一闪一闪亮晶晶 - 右手旋律+左手和弦
                    [['C3', 'E3', 'G3', 'C5'], 400], [['C3', 'E3', 'G3', 'C5'], 400],
                    [['C3', 'E3', 'G3', 'G5'], 400], [['C3', 'E3', 'G3', 'G5'], 400],
                    [['F3', 'A3', 'C4', 'A5'], 400], [['F3', 'A3', 'C4', 'A5'], 400],
                    [['C3', 'E3', 'G3', 'G5'], 800],
                    ['R', 200],
                    // 第二句: 满天都是小星星
                    [['F3', 'A3', 'C4', 'F5'], 400], [['F3', 'A3', 'C4', 'F5'], 400],
                    [['C3', 'E3', 'G3', 'E5'], 400], [['C3', 'E3', 'G3', 'E5'], 400],
                    [['G2', 'B2', 'D3', 'D5'], 400], [['G2', 'B2', 'D3', 'D5'], 400],
                    [['C3', 'E3', 'G3', 'C5'], 800],
                    ['R', 400],
                    // 第三句: 挂在天空放光明
                    [['C3', 'E3', 'G3', 'G5'], 400], [['C3', 'E3', 'G3', 'G5'], 400],
                    [['F3', 'A3', 'C4', 'F5'], 400], [['F3', 'A3', 'C4', 'F5'], 400],
                    [['C3', 'E3', 'G3', 'E5'], 400], [['C3', 'E3', 'G3', 'E5'], 400],
                    [['G2', 'B2', 'D3', 'D5'], 800],
                    ['R', 200],
                    // 第四句: 好像许多小眼睛
                    [['C3', 'E3', 'G3', 'G5'], 400], [['C3', 'E3', 'G3', 'G5'], 400],
                    [['F3', 'A3', 'C4', 'F5'], 400], [['F3', 'A3', 'C4', 'F5'], 400],
                    [['C3', 'E3', 'G3', 'E5'], 400], [['C3', 'E3', 'G3', 'E5'], 400],
                    [['G2', 'B2', 'D3', 'D5'], 800],
                    ['R', 400],
                    // 第五句: 一闪一闪亮晶晶 (重复)
                    [['C3', 'E3', 'G3', 'C5'], 400], [['C3', 'E3', 'G3', 'C5'], 400],
                    [['C3', 'E3', 'G3', 'G5'], 400], [['C3', 'E3', 'G3', 'G5'], 400],
                    [['F3', 'A3', 'C4', 'A5'], 400], [['F3', 'A3', 'C4', 'A5'], 400],
                    [['C3', 'E3', 'G3', 'G5'], 800],
                    ['R', 200],
                    // 第六句: 满天都是小星星 (结尾)
                    [['F3', 'A3', 'C4', 'F5'], 400], [['F3', 'A3', 'C4', 'F5'], 400],
                    [['C3', 'E3', 'G3', 'E5'], 400], [['C3', 'E3', 'G3', 'E5'], 400],
                    [['G2', 'B2', 'D3', 'D5'], 400], [['G2', 'B2', 'D3', 'D5'], 400],
                    [['C3', 'E3', 'G3', 'C5'], 800]
                ]
            },
            twinkle: {
                name: '小星星',
                notes: [
                    // 一闪一闪亮晶晶
                    ['C4', 400], ['C4', 400], ['G4', 400], ['G4', 400],
                    ['A4', 400], ['A4', 400], ['G4', 800],
                    ['R', 200], // 小暂停
                    // 满天都是小星星
                    ['F4', 400], ['F4', 400], ['E4', 400], ['E4', 400],
                    ['D4', 400], ['D4', 400], ['C4', 800],
                    ['R', 400], // 段落间暂停
                    // 挂在天空放光明
                    ['G4', 400], ['G4', 400], ['F4', 400], ['F4', 400],
                    ['E4', 400], ['E4', 400], ['D4', 800],
                    ['R', 200],
                    // 好像许多小眼睛
                    ['G4', 400], ['G4', 400], ['F4', 400], ['F4', 400],
                    ['E4', 400], ['E4', 400], ['D4', 800],
                    ['R', 400],
                    // 一闪一闪亮晶晶
                    ['C4', 400], ['C4', 400], ['G4', 400], ['G4', 400],
                    ['A4', 400], ['A4', 400], ['G4', 800],
                    ['R', 200],
                    // 满天都是小星星
                    ['F4', 400], ['F4', 400], ['E4', 400], ['E4', 400],
                    ['D4', 400], ['D4', 400], ['C4', 800]
                ]
            },
            erta: {
                name: '致爱丽丝',
                notes: [
                    // 主旋律 A段
                    ['E5', 250], ['D#5', 250], ['E5', 250], ['D#5', 250], ['E5', 250],
                    ['B4', 250], ['D5', 250], ['C5', 250], ['A4', 500],
                    ['R', 150],
                    ['C4', 250], ['E4', 250], ['A4', 250], ['B4', 500],
                    ['R', 150],
                    ['E4', 250], ['G#4', 250], ['B4', 250], ['C5', 500],
                    ['R', 150],
                    ['E4', 250], ['E5', 250], ['D#5', 250], ['E5', 250],
                    ['D#5', 250], ['E5', 250], ['B4', 250], ['D5', 250],
                    ['C5', 250], ['A4', 500],
                    ['R', 150],
                    ['C4', 250], ['E4', 250], ['A4', 250], ['B4', 500],
                    ['R', 150],
                    ['E4', 250], ['C5', 250], ['B4', 250], ['A4', 750],
                    ['R', 500], // 段落间暂停
                    // 主旋律 A段 重复
                    ['E5', 250], ['D#5', 250], ['E5', 250], ['D#5', 250], ['E5', 250],
                    ['B4', 250], ['D5', 250], ['C5', 250], ['A4', 500],
                    ['R', 150],
                    ['C4', 250], ['E4', 250], ['A4', 250], ['B4', 500],
                    ['R', 150],
                    ['E4', 250], ['G#4', 250], ['B4', 250], ['C5', 500],
                    ['R', 150],
                    ['E4', 250], ['E5', 250], ['D#5', 250], ['E5', 250],
                    ['D#5', 250], ['E5', 250], ['B4', 250], ['D5', 250],
                    ['C5', 250], ['A4', 500],
                    ['R', 150],
                    ['C4', 250], ['E4', 250], ['A4', 250], ['B4', 500],
                    ['R', 150],
                    ['E4', 250], ['C5', 250], ['B4', 250], ['A4', 750],
                    ['R', 500],
                    // B段
                    ['B4', 250], ['C5', 250], ['D5', 250], ['E5', 500],
                    ['R', 100],
                    ['G4', 250], ['F5', 250], ['E5', 250], ['D5', 500],
                    ['R', 100],
                    ['F4', 250], ['E5', 250], ['D5', 250], ['C5', 500],
                    ['R', 100],
                    ['E4', 250], ['D5', 250], ['C5', 250], ['B4', 500],
                    ['R', 150],
                    ['E4', 250], ['E5', 250], ['D#5', 250], ['E5', 250],
                    ['D#5', 250], ['E5', 250], ['B4', 250], ['D5', 250],
                    ['C5', 250], ['A4', 500],
                    ['R', 150],
                    ['C4', 250], ['E4', 250], ['A4', 250], ['B4', 500],
                    ['R', 150],
                    ['E4', 250], ['C5', 250], ['B4', 250], ['A4', 750]
                ]
            },
            birthday: {
                name: '生日快乐',
                notes: [
                    // 祝你生日快乐
                    ['G4', 300], ['G4', 200], ['A4', 500], ['G4', 500],
                    ['C5', 500], ['B4', 1000],
                    ['R', 300],
                    // 祝你生日快乐
                    ['G4', 300], ['G4', 200], ['A4', 500], ['G4', 500],
                    ['D5', 500], ['C5', 1000],
                    ['R', 300],
                    // 祝你生日快乐
                    ['G4', 300], ['G4', 200], ['G5', 500], ['E5', 500],
                    ['C5', 500], ['B4', 500], ['A4', 1000],
                    ['R', 300],
                    // 祝你生日快乐
                    ['F5', 300], ['F5', 200], ['E5', 500], ['C5', 500],
                    ['D5', 500], ['C5', 1000]
                ]
            },
            canon: {
                name: '卡农',
                notes: [
                    // 主旋律
                    ['F#5', 500], ['E5', 500], ['D5', 500], ['C#5', 500],
                    ['B4', 500], ['A4', 500], ['B4', 500], ['C#5', 500],
                    ['R', 300],
                    // 发展
                    ['D5', 500], ['C#5', 500], ['B4', 500], ['A4', 500],
                    ['G4', 500], ['F#4', 500], ['G4', 500], ['E4', 500],
                    ['R', 300],
                    // 变奏1
                    ['D4', 250], ['F#4', 250], ['A4', 250], ['G4', 250],
                    ['F#4', 250], ['D4', 250], ['F#4', 250], ['E4', 250],
                    ['D4', 250], ['B3', 250], ['D4', 250], ['A4', 250],
                    ['G4', 250], ['B4', 250], ['A4', 250], ['G4', 250],
                    ['R', 200],
                    // 变奏2
                    ['F#4', 250], ['D4', 250], ['E4', 250], ['C#5', 250],
                    ['D5', 250], ['F#5', 250], ['A5', 250], ['A4', 250],
                    ['B4', 250], ['G4', 250], ['A4', 250], ['F#4', 250],
                    ['D4', 250], ['D5', 250], ['C#5', 250], ['D5', 250],
                    ['R', 400],
                    // 高潮
                    ['D5', 500], ['C#5', 500], ['B4', 500], ['A4', 500],
                    ['G4', 500], ['F#4', 500], ['G4', 500], ['E4', 500],
                    ['D4', 1000]
                ]
            },
            ode: {
                name: '欢乐颂',
                notes: [
                    // 第一乐句
                    ['E4', 400], ['E4', 400], ['F4', 400], ['G4', 400],
                    ['G4', 400], ['F4', 400], ['E4', 400], ['D4', 400],
                    ['C4', 400], ['C4', 400], ['D4', 400], ['E4', 400],
                    ['E4', 600], ['D4', 200], ['D4', 800],
                    ['R', 400],
                    // 第二乐句
                    ['E4', 400], ['E4', 400], ['F4', 400], ['G4', 400],
                    ['G4', 400], ['F4', 400], ['E4', 400], ['D4', 400],
                    ['C4', 400], ['C4', 400], ['D4', 400], ['E4', 400],
                    ['D4', 600], ['C4', 200], ['C4', 800],
                    ['R', 400],
                    // 第三乐句（变化）
                    ['D4', 400], ['D4', 400], ['E4', 400], ['C4', 400],
                    ['D4', 400], ['E4', 200], ['F4', 200], ['E4', 400], ['C4', 400],
                    ['D4', 400], ['E4', 200], ['F4', 200], ['E4', 400], ['D4', 400],
                    ['C4', 400], ['D4', 400], ['G3', 800],
                    ['R', 400],
                    // 第四乐句（回到主题）
                    ['E4', 400], ['E4', 400], ['F4', 400], ['G4', 400],
                    ['G4', 400], ['F4', 400], ['E4', 400], ['D4', 400],
                    ['C4', 400], ['C4', 400], ['D4', 400], ['E4', 400],
                    ['D4', 600], ['C4', 200], ['C4', 800]
                ]
            }
        };

        // 完整的 88 键频率表 (A0 - C8)
        this.noteFrequencies = {
            "A0": 27.50, "A#0": 29.14, "B0": 30.87,
            "C1": 32.70, "C#1": 34.65, "D1": 36.71, "D#1": 38.89, "E1": 41.20, "F1": 43.65, "F#1": 46.25, "G1": 49.00, "G#1": 51.91, "A1": 55.00, "A#1": 58.27, "B1": 61.74,
            "C2": 65.41, "C#2": 69.30, "D2": 73.42, "D#2": 77.78, "E2": 82.41, "F2": 87.31, "F#2": 92.50, "G2": 98.00, "G#2": 103.83, "A2": 110.00, "A#2": 116.54, "B2": 123.47,
            "C3": 130.81, "C#3": 138.59, "D3": 146.83, "D#3": 155.56, "E3": 164.81, "F3": 174.61, "F#3": 185.00, "G3": 196.00, "G#3": 207.65, "A3": 220.00, "A#3": 233.08, "B3": 246.94,
            "C4": 261.63, "C#4": 277.18, "D4": 293.66, "D#4": 311.13, "E4": 329.63, "F4": 349.23, "F#4": 369.99, "G4": 392.00, "G#4": 415.30, "A4": 440.00, "A#4": 466.16, "B4": 493.88,
            "C5": 523.25, "C#5": 554.37, "D5": 587.33, "D#5": 622.25, "E5": 659.25, "F5": 698.46, "F#5": 739.99, "G5": 783.99, "G#5": 830.61, "A5": 880.00, "A#5": 932.33, "B5": 987.77,
            "C6": 1046.50, "C#6": 1108.73, "D6": 1174.66, "D#6": 1244.51, "E6": 1318.51, "F6": 1396.91, "F#6": 1479.98, "G6": 1567.98, "G#6": 1661.22, "A6": 1760.00, "A#6": 1864.66, "B6": 1975.53,
            "C7": 2093.00, "C#7": 2217.46, "D7": 2349.32, "D#7": 2489.02, "E7": 2637.02, "F7": 2793.83, "F#7": 2959.96, "G7": 3135.96, "G#7": 3322.44, "A7": 3520.00, "A#7": 3729.31, "B7": 3951.07,
            "C8": 4186.01
        };

        this.log('Piano Engine Initialized');
    }

    /**
     * 核心接口：触发一个音符
     * @param {string} noteName 音符名称 (如 "C4", "A#5")
     * @param {number} duration 声音持续时间 (秒)，不传则使用默认值
     */
    play(noteName, duration) {
        // 1. 检查音符是否存在
        const freq = this.noteFrequencies[noteName];
        if (!freq) {
            console.warn(`[Piano] Note not found: ${noteName}`);
            return;
        }

        // 2. 确保 AudioContext 处于运行状态 (解决浏览器自动播放策略限制)
        if (this.ctx.state === 'suspended') {
            this.ctx.resume().then(() => {
                this.log('AudioContext resumed');
                this._triggerSound(freq, duration);
            });
        } else {
            this._triggerSound(freq, duration);
        }
    }

    /**
     * 内部私有方法：执行具体的音频合成逻辑
     * @private
     */
    _triggerSound(freq, duration) {
        const t = this.ctx.currentTime;
        const dur = duration || this.defaultSustain;

        // --- 创建节点 ---
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // --- 配置振荡器 (声源) ---
        // 使用当前设置的音色类型
        osc.type = this.oscType;
        osc.frequency.value = freq;

        // --- 配置包络 (ADSR - 模拟钢琴的打击感) ---
        // 0. 初始静音
        gain.gain.setValueAtTime(0, t);
        // 1. Attack: 0.02秒内迅速达到峰值音量 (0.6)
        gain.gain.linearRampToValueAtTime(0.6, t + 0.02);
        // 2. Decay/Release: 在 duration 时间内按指数衰减到接近 0
        gain.gain.exponentialRampToValueAtTime(0.01, t + dur);

        // --- 连接节点图: Oscillator -> Gain -> Speaker ---
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        // --- 执行 ---
        osc.start(t);
        osc.stop(t + dur); // 播放完毕后自动销毁，节省内存

        // --- 垃圾回收清理 (可选，Web Audio 会自动处理 disconnect，但断开连接是个好习惯) ---
        setTimeout(() => {
            // 延时稍长一点确保声音播完了
            osc.disconnect();
            gain.disconnect();
        }, dur * 1000 + 100);

        this.log(`Playing: ${freq}Hz (${dur}s)`);
    }

    /**
     * 获取所有支持的音符列表 (用于生成 UI 键盘)
     * @returns {string[]} 音符名称数组
     */
    getNoteList() {
        return Object.keys(this.noteFrequencies);
    }

    /**
     * 开始播放一个音符 (按下琴键时调用)
     * 音符会持续播放直到调用 stopNote()
     * @param {string} noteName 音符名称 (如 "C4", "A#5")
     */
    startNote(noteName) {
        // 如果该音符已经在播放，先停止
        if (this.activeNotes.has(noteName)) {
            this.stopNote(noteName);
        }

        const freq = this.noteFrequencies[noteName];
        if (!freq) {
            console.warn(`[Piano] Note not found: ${noteName}`);
            return;
        }

        // 确保 AudioContext 处于运行状态
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const t = this.ctx.currentTime;

        // 创建节点
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // 配置振荡器
        osc.type = this.oscType;
        osc.frequency.value = freq;

        // 配置包络 - Attack 阶段
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.6, t + 0.02);
        // 保持在一个稳定音量 (Sustain)
        gain.gain.setValueAtTime(0.5, t + 0.05);

        // 连接节点
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        // 开始播放
        osc.start(t);

        // 保存引用以便后续停止
        this.activeNotes.set(noteName, { osc, gain });

        this.log(`Start: ${noteName} (${freq}Hz)`);
    }

    /**
     * 停止播放一个音符 (松开琴键时调用)
     * @param {string} noteName 音符名称 (如 "C4", "A#5")
     */
    stopNote(noteName) {
        const note = this.activeNotes.get(noteName);
        if (!note) return;

        const { osc, gain } = note;
        const t = this.ctx.currentTime;

        // Release 阶段 - 平滑淡出
        gain.gain.cancelScheduledValues(t);
        gain.gain.setValueAtTime(gain.gain.value, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

        // 延迟停止和清理
        osc.stop(t + 0.3);

        setTimeout(() => {
            osc.disconnect();
            gain.disconnect();
        }, 350);

        this.activeNotes.delete(noteName);

        this.log(`Stop: ${noteName}`);
    }

    /**
     * 停止所有正在播放的音符
     */
    stopAllNotes() {
        for (const noteName of this.activeNotes.keys()) {
            this.stopNote(noteName);
        }
    }

    // ==================== 和弦支持 (多音同时播放) ====================

    /**
     * 播放和弦 - 多个音符同时发声
     * @param {string|string[]} notes 音符或音符数组 (如 "C4" 或 ["C4", "E4", "G4"])
     * @param {number} duration 持续时间(秒)
     * @example
     * piano.playChord(['C4', 'E4', 'G4']); // C大三和弦
     * piano.playChord(['A3', 'C4', 'E4']); // A小三和弦
     */
    playChord(notes, duration) {
        const noteArray = Array.isArray(notes) ? notes : [notes];

        // 根据同时播放的音符数量调整音量，避免过载
        const volumeScale = Math.min(1, 1 / Math.sqrt(noteArray.length));

        noteArray.forEach(note => {
            if (note !== 'R' && note !== 'REST' && note !== '-') {
                this._triggerSoundWithVolume(note, duration, volumeScale);
            }
        });

        this.log(`Chord: [${noteArray.join(', ')}]`);
    }

    /**
     * 内部方法：带音量控制的声音触发
     * @private
     */
    _triggerSoundWithVolume(noteName, duration, volumeScale = 1) {
        const freq = this.noteFrequencies[noteName];
        if (!freq) {
            console.warn(`[Piano] Note not found: ${noteName}`);
            return;
        }

        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const t = this.ctx.currentTime;
        const dur = duration || this.defaultSustain;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = this.oscType;
        osc.frequency.value = freq;

        // 应用音量缩放
        const peakVolume = 0.6 * volumeScale;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(peakVolume, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, t + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + dur);

        setTimeout(() => {
            osc.disconnect();
            gain.disconnect();
        }, dur * 1000 + 100);
    }

    /**
     * 开始播放和弦 (按下多个琴键)
     * @param {string[]} notes 音符数组
     * @param {string} chordId 可选的和弦ID，用于后续停止
     * @returns {string} 和弦ID
     */
    startChord(notes, chordId) {
        const id = chordId || `chord_${Date.now()}`;
        const noteArray = Array.isArray(notes) ? notes : [notes];

        // 如果该和弦已存在，先停止
        if (this.activeNotes.has(id)) {
            this.stopChord(id);
        }

        const volumeScale = Math.min(1, 1 / Math.sqrt(noteArray.length));
        const chordNodes = [];

        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const t = this.ctx.currentTime;

        noteArray.forEach(noteName => {
            if (noteName === 'R' || noteName === 'REST' || noteName === '-') return;

            const freq = this.noteFrequencies[noteName];
            if (!freq) return;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = this.oscType;
            osc.frequency.value = freq;

            const peakVolume = 0.5 * volumeScale;
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(peakVolume, t + 0.02);
            gain.gain.setValueAtTime(peakVolume * 0.8, t + 0.05);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);

            chordNodes.push({ osc, gain, note: noteName });
        });

        this.activeNotes.set(id, { isChord: true, nodes: chordNodes });
        this.log(`Start Chord [${id}]: [${noteArray.join(', ')}]`);

        return id;
    }

    /**
     * 停止播放和弦
     * @param {string} chordId 和弦ID
     */
    stopChord(chordId) {
        const chord = this.activeNotes.get(chordId);
        if (!chord || !chord.isChord) return;

        const t = this.ctx.currentTime;

        chord.nodes.forEach(({ osc, gain }) => {
            gain.gain.cancelScheduledValues(t);
            gain.gain.setValueAtTime(gain.gain.value, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
            osc.stop(t + 0.3);

            setTimeout(() => {
                osc.disconnect();
                gain.disconnect();
            }, 350);
        });

        this.activeNotes.delete(chordId);
        this.log(`Stop Chord: ${chordId}`);
    }

    /**
     * 获取常用和弦
     * @param {string} root 根音 (如 "C4")
     * @param {string} type 和弦类型: 'major', 'minor', 'dim', 'aug', '7', 'maj7', 'min7'
     * @returns {string[]} 和弦音符数组
     */
    getChord(root, type = 'major') {
        const rootNote = root.slice(0, -1);
        const octave = parseInt(root.slice(-1));

        // 音符序列 (用于计算半音)
        const noteSequence = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const rootIndex = noteSequence.indexOf(rootNote);

        if (rootIndex === -1) {
            console.warn(`[Piano] Invalid root note: ${root}`);
            return [root];
        }

        // 和弦间隔定义 (半音数)
        const intervals = {
            'major': [0, 4, 7],           // 大三和弦
            'minor': [0, 3, 7],           // 小三和弦
            'dim': [0, 3, 6],             // 减三和弦
            'aug': [0, 4, 8],             // 增三和弦
            '7': [0, 4, 7, 10],           // 属七和弦
            'maj7': [0, 4, 7, 11],        // 大七和弦
            'min7': [0, 3, 7, 10],        // 小七和弦
            'sus2': [0, 2, 7],            // 挂二和弦
            'sus4': [0, 5, 7],            // 挂四和弦
            'add9': [0, 4, 7, 14],        // 加九和弦
            'power': [0, 7],              // 强力和弦 (五度)
        };

        const chordIntervals = intervals[type] || intervals['major'];

        return chordIntervals.map(interval => {
            const noteIndex = (rootIndex + interval) % 12;
            const octaveShift = Math.floor((rootIndex + interval) / 12);
            return noteSequence[noteIndex] + (octave + octaveShift);
        });
    }

    /**
     * 快捷播放常用和弦
     * @param {string} root 根音
     * @param {string} type 和弦类型
     * @param {number} duration 持续时间
     */
    playChordByName(root, type = 'major', duration) {
        const notes = this.getChord(root, type);
        this.playChord(notes, duration);
        return notes;
    }

    /**
     * 设置音色类型
     * @param {string} type 音色类型: 'triangle', 'sine', 'square', 'sawtooth'
     */
    setOscType(type) {
        const validTypes = ['triangle', 'sine', 'square', 'sawtooth'];
        if (validTypes.includes(type)) {
            this.oscType = type;
            this.log(`OscType changed to: ${type}`);
        } else {
            console.warn(`[Piano] Invalid osc type: ${type}`);
        }
    }

    /**
     * 获取当前音色类型
     * @returns {string} 当前音色类型
     */
    getOscType() {
        return this.oscType;
    }

    /**
     * 获取所有预设琴谱列表
     * @returns {Object} 琴谱对象
     */
    getSheets() {
        return this.sheets;
    }

    /**
     * 获取指定琴谱
     * @param {string} sheetId 琴谱ID
     * @returns {Object|null} 琴谱数据
     */
    getSheet(sheetId) {
        return this.sheets[sheetId] || null;
    }

    /**
     * 播放预设琴谱 (支持单音、和弦、休止符)
     * 
     * 琴谱格式支持:
     * - 单音: ['C4', 400]
     * - 和弦: [['C4', 'E4', 'G4'], 400]  (多个音符同时播放)
     * - 休止符: ['R', 400]
     * 
     * @param {string} sheetId 琴谱ID
     * @param {Function} onNote 每个音符播放时的回调 (noteName, duration, noteIndex)
     * @param {Function} onEnd 播放结束时的回调
     */
    playSheet(sheetId, onNote, onEnd) {
        const sheet = this.sheets[sheetId];
        if (!sheet) {
            console.warn(`[Piano] Sheet not found: ${sheetId}`);
            return false;
        }

        if (this.isPlaying) {
            this.stopSheet();
        }

        this.isPlaying = true;
        this.onNotePlay = onNote;
        this.onSheetEnd = onEnd;

        let delay = 0;

        sheet.notes.forEach((noteItem, index) => {
            const [note, duration] = noteItem;
            const timeout = setTimeout(() => {
                // 检查是否为休止符
                if (note === 'R' || note === 'REST' || note === '-') {
                    // 休止符：不播放声音，只触发回调显示
                    if (this.onNotePlay) {
                        this.onNotePlay('·', duration, index);
                    }
                }
                // 检查是否为和弦 (数组格式)
                else if (Array.isArray(note)) {
                    // 和弦：多个音符同时播放
                    this.playChord(note, duration / 1000);

                    if (this.onNotePlay) {
                        // 将和弦显示为 "C4+E4+G4" 格式
                        const chordDisplay = note.join('+');
                        this.onNotePlay(chordDisplay, duration, index);
                    }
                } else {
                    // 正常音符：播放声音
                    this.play(note, duration / 1000);

                    // 触发回调，传递音符索引
                    if (this.onNotePlay) {
                        this.onNotePlay(note, duration, index);
                    }
                }
            }, delay);

            this.playTimeouts.push(timeout);
            delay += duration;
        });

        // 播放完成后重置状态
        const finishTimeout = setTimeout(() => {
            this.isPlaying = false;
            if (this.onSheetEnd) {
                this.onSheetEnd();
            }
            this.log(`Sheet finished: ${sheetId}`);
        }, delay + 100);

        this.playTimeouts.push(finishTimeout);
        this.log(`Playing sheet: ${sheet.name}`);
        return true;
    }

    /**
     * 停止播放琴谱
     */
    stopSheet() {
        this.playTimeouts.forEach(timeout => clearTimeout(timeout));
        this.playTimeouts = [];
        this.isPlaying = false;
        this.stopAllNotes();
        this.log('Sheet stopped');
    }

    /**
     * 检查是否正在播放琴谱
     * @returns {boolean}
     */
    isSheetPlaying() {
        return this.isPlaying;
    }

    /**
     * 内部日志工具
     */
    log(msg) {
        if (this.debug) {
            console.log(`%c[Piano] ${msg}`, 'color: #00bcd4; font-weight: bold;');
        }
    }
}
// ========== 提示弹窗控制 ==========
const helpBtn = document.getElementById('helpBtn');
const tipsModal = document.getElementById('tipsModal');
const tipsClose = document.getElementById('tipsClose');
const tipsTitle = document.getElementById('tipsTitle');
const tipsList = document.getElementById('tipsList');

// 默认提示内容
const defaultTipsContent = {
    title: '💡 使用提示',
    items: [
        '点击琴键播放音符',
        '按住琴键持续发声，松开停止',
        'C2八度(Shift): ! @ # $ % ^ & * ( ) _ +',
        'C3八度: Z S X D C V G B H N J M',
        'C4八度: Q 2 W 3 E R 5 T 6 Y 7 U',
        'C5八度: I 9 O 0 P [ = ] \\ A L F',
        'C6八度: 1 4 8 - K ; \' , . /'
    ]
};

// 宽度不足提示内容
const widthWarningContent = {
    title: '⚠️ 页面宽度不足',
    items: [
        '当前窗口宽度无法完整显示所有琴键',
        '可以横向滚动钢琴区域查看更多琴键',
        '建议将浏览器窗口调宽或使用全屏模式',
        '推荐宽度: 1300px 以上'
    ]
};

// 显示提示弹窗
function showTips(content) {
    tipsTitle.textContent = content.title;
    tipsList.innerHTML = content.items.map(item => `<li>${item}</li>`).join('');
    tipsModal.classList.add('show');
}

helpBtn.addEventListener('click', () => {
    showTips(defaultTipsContent);
});

tipsClose.addEventListener('click', () => {
    tipsModal.classList.remove('show');
});

tipsModal.addEventListener('click', (e) => {
    if (e.target === tipsModal) {
        tipsModal.classList.remove('show');
    }
});

// ========== 页面宽度检测 ==========
const pianoElement = document.getElementById('piano');
let widthWarningShown = false;
let lastWidthSufficient = true;

function checkPianoWidth() {
    const pianoWidth = pianoElement.scrollWidth;
    const viewportWidth = window.innerWidth;
    const isWidthSufficient = viewportWidth >= pianoWidth + 80; // 加上边距

    // 只在宽度从足够变为不足时显示警告（且之前没显示过或状态变化了）
    if (!isWidthSufficient && lastWidthSufficient && !widthWarningShown) {
        // 延迟显示，避免页面加载时立即弹出
        setTimeout(() => {
            if (!tipsModal.classList.contains('show')) {
                showTips(widthWarningContent);
                widthWarningShown = true;
            }
        }, 500);
    }

    lastWidthSufficient = isWidthSufficient;
}

// 初始检测（延迟执行等待DOM完全渲染）
setTimeout(checkPianoWidth, 1000);

// 监听窗口大小变化
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // 重置警告状态，允许再次显示
        if (lastWidthSufficient) {
            widthWarningShown = false;
        }
        checkPianoWidth();
    }, 300);
});

// ========== 音色选择控制 ==========
const toneSelect = document.getElementById('toneSelect');

// ========== 手机竖屏检测 ==========
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || ('ontouchstart' in window)
        || (navigator.maxTouchPoints > 0);
}

const rotateHint = document.getElementById('rotateHint');
const rotateHintDismiss = document.getElementById('rotateHintDismiss');
let forcePortrait = false;

function checkOrientation() {
    const isMobile = isMobileDevice();
    const isPortrait = window.innerHeight > window.innerWidth;

    if (isMobile && isPortrait && !forcePortrait) {
        document.body.classList.add('mobile-portrait');
    } else {
        document.body.classList.remove('mobile-portrait');
    }
}

// 用户选择继续使用竖屏
rotateHintDismiss.addEventListener('click', () => {
    forcePortrait = true;
    document.body.classList.add('force-portrait');
    document.body.classList.remove('mobile-portrait');
});

// 初始检测
checkOrientation();

// 监听窗口大小变化和方向变化
window.addEventListener('resize', () => {
    // 如果转到横屏，重置 forcePortrait
    if (window.innerWidth > window.innerHeight) {
        forcePortrait = false;
        document.body.classList.remove('force-portrait');
    }
    checkOrientation();
});
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        if (window.innerWidth > window.innerHeight) {
            forcePortrait = false;
            document.body.classList.remove('force-portrait');
        }
        checkOrientation();
    }, 100);
});

// ========== 钢琴引擎初始化 ==========
// 初始化钢琴引擎
const piano = new SimplePiano({ debug: true });

// 音色选择事件
toneSelect.addEventListener('change', (e) => {
    piano.setOscType(e.target.value);
});

// 键盘映射表
const keyMap = {
    // 最低八度 (C2 - B2) - 使用 Shift+字母 或功能键
    '!': 'C2', '@': 'C#2', '#': 'D2', '$': 'D#2', '%': 'E2',
    '^': 'F2', '&': 'F#2', '*': 'G2', '(': 'G#2', ')': 'A2', '_': 'A#2', '+': 'B2',
    // 低八度 (C3 - B3)
    'z': 'C3', 's': 'C#3', 'x': 'D3', 'd': 'D#3', 'c': 'E3',
    'v': 'F3', 'g': 'F#3', 'b': 'G3', 'h': 'G#3', 'n': 'A3', 'j': 'A#3', 'm': 'B3',
    // 中八度 (C4 - B4)
    'q': 'C4', '2': 'C#4', 'w': 'D4', '3': 'D#4', 'e': 'E4',
    'r': 'F4', '5': 'F#4', 't': 'G4', '6': 'G#4', 'y': 'A4', '7': 'A#4', 'u': 'B4',
    // 高八度 (C5 - B5)
    'i': 'C5', '9': 'C#5', 'o': 'D5', '0': 'D#5', 'p': 'E5',
    '[': 'F5', '=': 'F#5', ']': 'G5', '\\': 'G#5', 'a': 'A5', 'l': 'A#5', 'f': 'B5',
    // 更高八度 (C6 - B6)
    '1': 'C6', '4': 'C#6', '8': 'D6', '-': 'D#6', 'k': 'E6',
    ';': 'F6', "'": 'F#6', ',': 'G6', '.': 'G#6', '/': 'A6'
};

// 反向映射: 音符 -> 按键
const noteToKey = {};
for (const [key, note] of Object.entries(keyMap)) {
    noteToKey[note] = key.toUpperCase();
}

const currentNoteDisplay = document.getElementById('currentNote');

// 更新当前音符显示
function updateNoteDisplay(noteName) {
    currentNoteDisplay.textContent = noteName;
    currentNoteDisplay.classList.add('active');
}

function clearNoteDisplay() {
    currentNoteDisplay.classList.remove('active');
}

// 鼠标/触摸事件 - 点击琴键
document.querySelectorAll('.key').forEach(key => {
    const noteName = key.dataset.note;

    key.addEventListener('mousedown', () => {
        piano.startNote(noteName);
        updateNoteDisplay(noteName);
        key.classList.add('pressed');
    });

    key.addEventListener('mouseup', () => {
        piano.stopNote(noteName);
        clearNoteDisplay();
        key.classList.remove('pressed');
    });

    key.addEventListener('mouseleave', () => {
        piano.stopNote(noteName);
        clearNoteDisplay();
        key.classList.remove('pressed');
    });

    // 触摸支持
    key.addEventListener('touchstart', (e) => {
        e.preventDefault();
        piano.startNote(noteName);
        updateNoteDisplay(noteName);
        key.classList.add('pressed');
    });

    key.addEventListener('touchend', () => {
        piano.stopNote(noteName);
        clearNoteDisplay();
        key.classList.remove('pressed');
    });
});

// 键盘事件
const pressedKeys = new Set();

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (keyMap[key] && !pressedKeys.has(key)) {
        pressedKeys.add(key);
        const noteName = keyMap[key];
        piano.startNote(noteName);
        updateNoteDisplay(noteName);

        // 高亮对应琴键
        const keyElement = document.querySelector(`.key[data-note="${noteName}"]`);
        if (keyElement) {
            keyElement.classList.add('pressed');
        }
    }
});

document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (keyMap[key]) {
        pressedKeys.delete(key);
        const noteName = keyMap[key];
        piano.stopNote(noteName);
        clearNoteDisplay();

        const keyElement = document.querySelector(`.key[data-note="${noteName}"]`);
        if (keyElement) {
            keyElement.classList.remove('pressed');
        }
    }
});

// 窗口失焦时停止所有音符
window.addEventListener('blur', () => {
    piano.stopAllNotes();
    pressedKeys.clear();
    document.querySelectorAll('.key.pressed').forEach(key => {
        key.classList.remove('pressed');
    });
    clearNoteDisplay();
});

// ========== 预设琴谱功能 ==========
let currentSheetItem = null;
let currentSheetId = null;
let currentNoteIndex = -1;
const sheetDisplay = document.getElementById('sheetDisplay');
const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');
const notationBtn = document.getElementById('notationBtn');
let noteElements = [];
let showKeyboard = false; // false = 音符名称, true = 键盘按键

// 音符转按键显示
function noteToDisplay(note) {
    if (showKeyboard) {
        return noteToKey[note] || note;
    }
    return note;
}

// 渲染琴谱到中间面板
function renderSheet(sheetId) {
    const sheet = piano.getSheet(sheetId);
    if (!sheet) return;

    sheetDisplay.innerHTML = '';
    noteElements = [];
    currentNoteIndex = -1;

    sheet.notes.forEach((noteItem, index) => {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note-item';

        const note = noteItem[0]; // noteItem 是 [note, duration] 数组
        noteDiv.dataset.note = JSON.stringify(note); // 保存原始音符数据

        // 和弦显示: 数组时显示为 "♫n" (n为音符数量) 或休止符显示为 "·"
        if (Array.isArray(note)) {
            if (showKeyboard) {
                // 键盘模式：显示按键组合
                const keys = note.map(n => noteToKey[n] || '?').join('');
                noteDiv.textContent = keys.length > 3 ? keys.slice(0, 3) + '..' : keys;
            } else {
                noteDiv.textContent = `♫${note.length}`;
            }
            noteDiv.title = note.join(' + ');
            noteDiv.classList.add('chord');
        } else if (note === 'R' || note === 'REST' || note === '-') {
            noteDiv.textContent = '·';
            noteDiv.classList.add('rest');
        } else {
            noteDiv.textContent = noteToDisplay(note);
        }

        noteDiv.dataset.index = index;
        noteElements.push(noteDiv);
        sheetDisplay.appendChild(noteDiv);
    });
}

// 高亮琴键并更新琴谱显示的回调函数
function onNotePlay(note, duration, noteIndex) {
    updateNoteDisplay(note);

    // 更新琴谱显示中的当前音符
    if (currentNoteIndex >= 0 && currentNoteIndex < noteElements.length) {
        noteElements[currentNoteIndex].classList.remove('current');
        noteElements[currentNoteIndex].classList.add('played');
    }
    currentNoteIndex = noteIndex;
    if (currentNoteIndex >= 0 && currentNoteIndex < noteElements.length) {
        noteElements[currentNoteIndex].classList.add('current');
        // 滚动到可见区域
        noteElements[currentNoteIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    const keyElement = document.querySelector(`.key[data-note="${note}"]`);
    if (keyElement) {
        keyElement.classList.add('pressed');
        setTimeout(() => {
            keyElement.classList.remove('pressed');
        }, duration * 0.8);
    }
}

// 播放结束的回调函数
function onSheetEnd() {
    if (currentSheetItem) {
        currentSheetItem.classList.remove('playing');
    }
    clearNoteDisplay();
    updateControlButtons(false);

    // 标记最后一个音符为已播放
    if (currentNoteIndex >= 0 && currentNoteIndex < noteElements.length) {
        noteElements[currentNoteIndex].classList.remove('current');
        noteElements[currentNoteIndex].classList.add('played');
    }
}

// 更新控制按钮状态
function updateControlButtons(isPlaying) {
    if (isPlaying) {
        playBtn.disabled = true;
        stopBtn.disabled = false;
    } else if (currentSheetId) {
        playBtn.disabled = false;
        stopBtn.disabled = true;
    } else {
        playBtn.disabled = true;
        stopBtn.disabled = true;
    }
}

// 停止播放并清理UI
function stopSheetUI() {
    piano.stopSheet();

    document.querySelectorAll('.key.pressed').forEach(key => {
        key.classList.remove('pressed');
    });

    if (currentSheetItem) {
        currentSheetItem.classList.remove('playing');
    }

    clearNoteDisplay();
    updateControlButtons(false);
}

// 重置琴谱显示状态
function resetSheetDisplay() {
    noteElements.forEach(el => {
        el.classList.remove('current', 'played');
    });
    currentNoteIndex = -1;
}

// 播放按钮事件
playBtn.addEventListener('click', () => {
    if (currentSheetId && !piano.isSheetPlaying()) {
        resetSheetDisplay();
        if (currentSheetItem) {
            currentSheetItem.classList.add('playing');
        }
        updateControlButtons(true);
        piano.playSheet(currentSheetId, onNotePlay, onSheetEnd);
    }
});

// 停止按钮事件
stopBtn.addEventListener('click', () => {
    stopSheetUI();
});

// 切换显示模式按钮事件
notationBtn.addEventListener('click', () => {
    showKeyboard = !showKeyboard;

    // 更新按钮文本
    const icon = notationBtn.querySelector('.notation-icon');
    const text = notationBtn.querySelector('.notation-text');
    if (showKeyboard) {
        icon.textContent = '🎵';
        text.textContent = '音符';
        notationBtn.classList.add('active');
    } else {
        icon.textContent = '⌨';
        text.textContent = '按键';
        notationBtn.classList.remove('active');
    }

    // 重新渲染当前琴谱
    if (currentSheetId) {
        const savedIndex = currentNoteIndex;
        const playedIndices = [];
        noteElements.forEach((el, i) => {
            if (el.classList.contains('played')) playedIndices.push(i);
        });

        renderSheet(currentSheetId);

        // 恢复播放状态
        playedIndices.forEach(i => {
            if (noteElements[i]) noteElements[i].classList.add('played');
        });
        if (savedIndex >= 0 && noteElements[savedIndex]) {
            noteElements[savedIndex].classList.add('current');
        }
        currentNoteIndex = savedIndex;
    }
});

// 琴谱点击事件 - 只选择和显示，不播放
document.querySelectorAll('.sheet-item').forEach(item => {
    item.addEventListener('click', () => {
        const sheetId = item.dataset.sheet;

        // 如果正在播放，先停止
        if (piano.isSheetPlaying()) {
            stopSheetUI();
        }

        // 清除之前的高亮
        document.querySelectorAll('.sheet-item.active').forEach(i => {
            i.classList.remove('active');
        });

        // 高亮当前选择的琴谱
        currentSheetItem = item;
        currentSheetItem.classList.add('active');
        currentSheetId = sheetId;

        // 渲染琴谱到中间面板
        renderSheet(sheetId);

        // 启用播放按钮
        updateControlButtons(false);
    });
});