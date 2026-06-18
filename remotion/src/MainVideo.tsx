import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
} from "remotion";
import { loadFont as loadTrade } from "@remotion/google-fonts/TradeWinds";
import { loadFont as loadSpace } from "@remotion/google-fonts/SpaceGrotesk";

const trade = loadTrade("normal", { weights: ["400"], subsets: ["latin"] });
const space = loadSpace("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

const ORANGE = "#ff5722";
const YELLOW = "#ffeb3b";
const BLACK = "#0a0a0a";
const WHITE = "#ffffff";

const SHOTS = [
  "shots/01-Screenshot_20260614-021904_Chrome.png",
  "shots/02-Screenshot_20260614-021935_Chrome.png",
  "shots/03-Screenshot_20260614-022001_Chrome.png",
  "shots/04-Screenshot_20260614-022104_Chrome.png",
  "shots/05-Screenshot_20260614-022151_Chrome.png",
  "shots/06-Screenshot_20260614-022220_Chrome.png",
  "shots/07-Screenshot_20260614-022347_Chrome.png",
  "shots/08-Screenshot_20260614-022424_Chrome.png",
];

const CAPTIONS = [
  "Scroll. Watch. Buy.",
  "Real videos, real items",
  "Discover unique finds",
  "Tap to see details",
  "Message sellers fast",
  "Save your favorites",
  "List in seconds",
  "Your marketplace",
];

const INTRO = 75; // 2.5s
const PER_SHOT = 75; // 2.5s each x 8 = 600
const OUTRO = 105; // 3.5s
const QR_END = 150; // 5s
export const TOTAL_FRAMES = INTRO + PER_SHOT * SHOTS.length + OUTRO + QR_END; // 930

const BgGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = (frame * 1.2) % 80;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: YELLOW,
        backgroundImage: `linear-gradient(${BLACK} 2px, transparent 2px), linear-gradient(90deg, ${BLACK} 2px, transparent 2px)`,
        backgroundSize: "80px 80px",
        backgroundPosition: `${shift}px ${shift}px`,
        opacity: 1,
      }}
    />
  );
};

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = spring({ frame, fps, config: { damping: 9, stiffness: 180 } });
  const scale = interpolate(slam, [0, 1], [2.4, 1]);
  const rot = interpolate(slam, [0, 1], [-12, -3]);
  const sub = spring({
    frame: frame - 18,
    fps,
    config: { damping: 14, stiffness: 160 },
  });
  const subY = interpolate(sub, [0, 1], [60, 0]);
  return (
    <AbsoluteFill>
      <BgGrid />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: 60,
        }}
      >
        <div
          style={{
            transform: `rotate(${rot}deg) scale(${scale})`,
            background: BLACK,
            color: ORANGE,
            padding: "30px 60px",
            border: `8px solid ${BLACK}`,
            boxShadow: `16px 16px 0 ${ORANGE}`,
            fontFamily: trade.fontFamily,
            fontSize: 180,
            lineHeight: 1,
          }}
        >
          TomaShops
        </div>
        <div
          style={{
            marginTop: 80,
            transform: `translateY(${subY}px)`,
            opacity: sub,
            background: ORANGE,
            color: BLACK,
            padding: "20px 36px",
            border: `6px solid ${BLACK}`,
            boxShadow: `10px 10px 0 ${BLACK}`,
            fontFamily: space.fontFamily,
            fontWeight: 700,
            fontSize: 52,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          Video 1st Marketplace
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ShotScene: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 140 },
  });
  const exit = interpolate(frame, [PER_SHOT - 12, PER_SHOT], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const phoneScale = interpolate(enter, [0, 1], [0.6, 1]) * (1 - exit * 0.15);
  const phoneRot = interpolate(enter, [0, 1], [-8, index % 2 === 0 ? -2 : 2]);
  const phoneY = interpolate(enter, [0, 1], [200, 0]) + exit * -120;
  const phoneOpacity = 1 - exit;

  const capEnter = spring({
    frame: frame - 8,
    fps,
    config: { damping: 12, stiffness: 160 },
  });
  const capX = interpolate(capEnter, [0, 1], [-600, 0]);

  // floating accent
  const accentY = Math.sin((frame / fps) * 2) * 14;

  const bg = index % 2 === 0 ? ORANGE : YELLOW;

  return (
    <AbsoluteFill style={{ background: bg }}>
      {/* halftone dots accent */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${BLACK} 6px, transparent 7px)`,
          backgroundSize: "44px 44px",
          opacity: 0.18,
        }}
      />
      {/* corner chip */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 50,
          background: BLACK,
          color: WHITE,
          fontFamily: space.fontFamily,
          fontWeight: 700,
          fontSize: 36,
          padding: "12px 22px",
          border: `5px solid ${BLACK}`,
          boxShadow: `8px 8px 0 ${WHITE}`,
          textTransform: "uppercase",
          letterSpacing: 2,
        }}
      >
        0{index + 1} / 0{SHOTS.length}
      </div>

      {/* phone frame */}
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <div
          style={{
            transform: `translateY(${phoneY}px) rotate(${phoneRot}deg) scale(${phoneScale})`,
            opacity: phoneOpacity,
            position: "relative",
          }}
        >
          {/* hard shadow */}
          <div
            style={{
              position: "absolute",
              top: 24,
              left: 24,
              width: 560,
              height: 1140,
              background: BLACK,
              borderRadius: 56,
            }}
          />
          <div
            style={{
              width: 560,
              height: 1140,
              background: BLACK,
              borderRadius: 56,
              border: `8px solid ${BLACK}`,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Img
              src={staticFile(SHOTS[index])}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        </div>
      </AbsoluteFill>

      {/* caption banner */}
      <div
        style={{
          position: "absolute",
          bottom: 120 + accentY,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          transform: `translateX(${capX}px)`,
        }}
      >
        <div
          style={{
            background: BLACK,
            color: index % 2 === 0 ? YELLOW : ORANGE,
            fontFamily: trade.fontFamily,
            fontSize: 88,
            padding: "20px 48px",
            border: `6px solid ${BLACK}`,
            boxShadow: `12px 12px 0 ${WHITE}`,
            transform: "rotate(-2deg)",
            lineHeight: 1.05,
            maxWidth: 900,
            textAlign: "center",
          }}
        >
          {CAPTIONS[index]}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s1 = spring({ frame, fps, config: { damping: 10, stiffness: 150 } });
  const s2 = spring({
    frame: frame - 14,
    fps,
    config: { damping: 12, stiffness: 160 },
  });
  const s3 = spring({
    frame: frame - 28,
    fps,
    config: { damping: 10, stiffness: 180 },
  });
  const pulse = 1 + Math.sin((frame / fps) * 6) * 0.04;
  return (
    <AbsoluteFill style={{ background: BLACK }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${ORANGE} 4px, transparent 5px)`,
          backgroundSize: "60px 60px",
          opacity: 0.25,
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: 50,
          padding: 60,
        }}
      >
        <div
          style={{
            transform: `scale(${s1})`,
            width: 320,
            height: 320,
            background: WHITE,
            border: `8px solid ${WHITE}`,
            boxShadow: `16px 16px 0 ${ORANGE}`,
            overflow: "hidden",
            borderRadius: 64,
          }}
        >
          <Img
            src={staticFile("icon.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div
          style={{
            opacity: s2,
            transform: `translateY(${interpolate(s2, [0, 1], [40, 0])}px)`,
            fontFamily: trade.fontFamily,
            color: YELLOW,
            fontSize: 150,
            textAlign: "center",
            lineHeight: 1,
          }}
        >
          TomaShops
        </div>
        <div
          style={{
            opacity: s2,
            color: WHITE,
            fontFamily: space.fontFamily,
            fontWeight: 700,
            fontSize: 44,
            textTransform: "uppercase",
            letterSpacing: 3,
            textAlign: "center",
          }}
        >
          Video 1st Marketplace
        </div>
        <div
          style={{
            transform: `scale(${s3 * pulse})`,
            background: ORANGE,
            color: BLACK,
            fontFamily: space.fontFamily,
            fontWeight: 700,
            fontSize: 58,
            padding: "26px 50px",
            border: `8px solid ${WHITE}`,
            boxShadow: `12px 12px 0 ${YELLOW}`,
            textTransform: "uppercase",
            letterSpacing: 2,
            textAlign: "center",
          }}
        >
          Get it on Google Play
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BLACK }}>
      <Sequence durationInFrames={INTRO}>
        <Intro />
      </Sequence>
      {SHOTS.map((_, i) => (
        <Sequence
          key={i}
          from={INTRO + i * PER_SHOT}
          durationInFrames={PER_SHOT}
        >
          <ShotScene index={i} />
        </Sequence>
      ))}
      <Sequence from={INTRO + SHOTS.length * PER_SHOT} durationInFrames={OUTRO}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
