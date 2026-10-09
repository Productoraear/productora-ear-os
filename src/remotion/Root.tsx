import { Composition, registerRoot } from 'remotion';
import { EarOsPromo, EarOsPromoProps, defaultEarOsPromoProps, defaultScenes } from './EarOsPromo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="EarOsPromo"
        component={EarOsPromo}
        durationInFrames={540} // 9 segundos a 60 fps (3 escenas de 3s)
        fps={60}
        width={1920}
        height={1080}
        calculateMetadata={async ({ props }: { props: EarOsPromoProps }) => {
          let width = 1920;
          let height = 1080;
          
          if (props?.aspectRatio === '9:16') {
            width = 1080;
            height = 1920;
          } else if (props?.aspectRatio === '1:1') {
            width = 1080;
            height = 1080;
          } else if (props?.aspectRatio === '4:5') {
            width = 1080;
            height = 1350;
          }

          const fps = 60;
          const scenes = props?.scenes && props.scenes.length > 0 ? props.scenes : defaultScenes;
          const totalSeconds = scenes.reduce((acc, s) => acc + (s.durationInSeconds || 3), 0);
          const durationInFrames = Math.max(120, totalSeconds * fps);

          return {
            width,
            height,
            durationInFrames,
            fps,
            props,
          };
        }}
        defaultProps={defaultEarOsPromoProps}
      />
    </>
  );
};

registerRoot(RemotionRoot);
