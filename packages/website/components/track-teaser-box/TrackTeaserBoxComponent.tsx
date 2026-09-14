import { createContext, forwardRef, useContext } from "react";
import type { HTMLAttributes } from "react";
import { PictureContext } from "@kickstartds/base/lib/picture";
import type { TrackTeaserBoxProps } from "./TrackTeaserBoxProps";
import { deepMergeDefaults } from "../helpers";
import defaults from "./TrackTeaserBoxDefaults";

/**
 * Asset and link fields are rewritten by `storyProcessing` in `helpers/storyblok.ts`:
 * assets become plain URLs and multilinks become plain strings. Accept both shapes
 * so the component also works when rendered from code.
 */
type AssetValue = string | { filename?: string };
type LinkValue = string | { url?: string; cached_url?: string };

const resolveUrl = (value?: LinkValue): string | undefined => {
  if (!value) return undefined;
  return typeof value === "string" ? value : value.url || value.cached_url;
};

const resolveAsset = (value?: AssetValue): string | undefined => {
  if (!value) return undefined;
  return typeof value === "string" ? value : value.filename;
};

/**
 * Flip card for a single track: cover, topic and artist on the front, a native
 * audio player on the back. Behaviour (flipping, pausing, resetting after the
 * track ends) lives in `track-teaser-box.client.js` — this component only
 * renders markup, per the design-system rule that components stay stateless.
 */
export const TrackTeaserBoxContextDefault = forwardRef<
  HTMLElement,
  TrackTeaserBoxProps & HTMLAttributes<HTMLElement>
>(({ topic, text, image, alt, preview, ...props }, ref) => {
  const cover = resolveAsset(image);
  const audioUrl = resolveUrl(preview);
  const Picture = useContext(PictureContext);

  return (
    <article
      className="dsa-track-teaser-box"
      data-track-teaser-box
      {...props}
      ref={ref}
    >
      <div className="dsa-track-teaser-box__inner">
        <div className="dsa-track-teaser-box__face dsa-track-teaser-box__face--front">
          {cover && (
            <Picture
              className="dsa-track-teaser-box__image"
              src={cover}
              alt={alt || ""}
            />
          )}
          <div className="dsa-track-teaser-box__body">
            {topic && <p className="dsa-track-teaser-box__topic">{topic}</p>}
            {text && <p className="dsa-track-teaser-box__text">{text}</p>}
          </div>
          {audioUrl && (
            <button
              type="button"
              className="dsa-track-teaser-box__flip"
              data-track-teaser-box-flip
              aria-pressed="false"
            >
              Listen
            </button>
          )}
        </div>
        <div className="dsa-track-teaser-box__face dsa-track-teaser-box__face--back">
          {topic && <p className="dsa-track-teaser-box__topic">{topic}</p>}
          <audio
            className="dsa-track-teaser-box__audio"
            src={audioUrl}
            preload="none"
            controls
            data-track-teaser-box-audio
          />
          <button
            type="button"
            className="dsa-track-teaser-box__flip"
            data-track-teaser-box-flip
            aria-pressed="false"
          >
            Back
          </button>
        </div>
      </div>
    </article>
  );
});
TrackTeaserBoxContextDefault.displayName = "Track Teaser Box Context Default";

export const TrackTeaserBoxContext = createContext(TrackTeaserBoxContextDefault);
export const TrackTeaserBox = forwardRef<
  HTMLElement,
  TrackTeaserBoxProps & HTMLAttributes<HTMLElement>
>((props, ref) => {
  const Component = useContext(TrackTeaserBoxContext);
  return <Component {...deepMergeDefaults(defaults, props)} ref={ref} />;
});
TrackTeaserBox.displayName = "Track Teaser Box";
