import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { X } from "lucide-react";
import { ORBITS } from "../../lib/images";

interface OrbitImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

interface OrbitingCarouselProps {
  maxWidth?: number;
  height?: number;
  orbitX?: number;
  orbitY?: number;
  imageSize?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  className?: string;
}

const OrbitingCarousel: React.FC<
  OrbitingCarouselProps
> = ({
  maxWidth = 900,
  height = 520,
  orbitX = 38,
  orbitY = 24,
  imageSize = 110,
  autoRotate = true,
  autoRotateSpeed = 0.18,
  className = "",
}) => {
  const [angle, setAngle] = useState(0);
  const [selectedImage, setSelectedImage] =
    useState<OrbitImage | null>(null);

  /*
   * Use the specific ORBITS array directly.
   *
   * The order here is exactly the order
   * you defined in images.ts.
   */
  const images = useMemo<OrbitImage[]>(
    () => ORBITS,
    []
  );

  /*
   * Evenly distribute images around the orbit.
   */
  const positions = useMemo(() => {
    if (!images.length) return [];

    return images.map((image, index) => ({
      image,
      baseAngle:
        (360 / images.length) * index,
    }));
  }, [images]);

  /*
   * Automatic rotation.
   */
  useEffect(() => {
    if (!autoRotate) return;

    let frame: number;

    const animate = () => {
      setAngle(
        (previous) =>
          previous + autoRotateSpeed
      );

      frame =
        requestAnimationFrame(animate);
    };

    frame =
      requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [autoRotate, autoRotateSpeed]);

  if (!images.length) {
    return null;
  }

  return (
    <>
      <div
        className={`
          relative
          mx-auto
          w-full
          overflow-visible
          ${className}
        `}
        style={{
          maxWidth,
          height,
          perspective: "1200px",
        }}
      >
        {/* ================================
            GLOW
        ================================= */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
          "
          style={{
            width: "65%",
            height: "45%",
            background:
              "radial-gradient(ellipse, color-mix(in srgb, var(--doba-green) 14%, transparent), transparent 70%)",
            filter: "blur(45px)",
          }}
        />

        {/* ================================
            ORBIT RING
        ================================= */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            rounded-[50%]
            border
            border-white/10
          "
          style={{
            width: `${orbitX * 2}%`,
            height: `${orbitY * 2}%`,
          }}
        />

        {/* ================================
            ORBITING IMAGES
        ================================= */}
        <div className="absolute inset-0">
          {positions.map(
            ({ image, baseAngle }) => {
              const currentAngle =
                baseAngle + angle;

              const radians =
                (currentAngle * Math.PI) /
                180;

              /*
               * Elliptical orbit.
               */
              const x =
                Math.sin(radians) *
                orbitX;

              const y =
                Math.cos(radians) *
                orbitY;

              /*
               * Depth.
               *
               * 1 = front
               * 0 = back
               */
              const depth =
                (Math.cos(radians) + 1) /
                2;

              /*
               * Front images become larger.
               */
              const scale =
                0.68 + depth * 0.42;

              /*
               * Front images become brighter.
               */
              const opacity =
                0.35 + depth * 0.65;

              /*
               * Slight blur at the back.
               */
              const blur =
                depth < 0.3
                  ? `${(0.3 - depth) * 3}px`
                  : "0px";

              /*
               * Make front images render above
               * the back images.
               */
              const zIndex =
                Math.round(depth * 100);

              const isFront =
                depth > 0.88;

              return (
                <div
                  key={image.id}
                  className="
                    absolute
                    left-1/2
                    top-1/2
                  "
                  style={{
                    width: imageSize,
                    height: imageSize,

                    transform: `
                      translate(-50%, -50%)
                      translate(
                        ${x}%,
                        ${y}%
                      )
                      scale(${scale})
                    `,

                    opacity,
                    zIndex,

                    filter:
                      `blur(${blur})`,

                    willChange:
                      "transform",

                    transition:
                      "opacity 300ms ease, filter 300ms ease",
                  }}
                >
                  <button
                    type="button"
                    aria-label={`View ${image.alt}`}
                    className={`
                      group
                      relative
                      h-full
                      w-full
                      overflow-hidden
                      rounded-full
                      border
                      bg-black/20
                      shadow-2xl
                      outline-none
                      transition-all
                      duration-300

                      ${
                        isFront
                          ? "border-white/40"
                          : "border-white/10"
                      }
                    `}
                    onClick={(event) => {
                      event.stopPropagation();

                      if (depth > 0.72) {
                        setSelectedImage(
                          image
                        );
                      }
                    }}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      draggable={false}
                      loading="lazy"
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-110
                      "
                    />

                    {/* Image highlight */}
                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        rounded-full
                        bg-gradient-to-br
                        from-white/20
                        via-transparent
                        to-black/40
                      "
                    />
                  </button>
                </div>
              );
            }
          )}
        </div>

        {/* ================================
            CENTER CONTENT
        ================================= */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            flex
            items-center
            justify-center
          "
        >
          <div className="text-center">
            <div
              className="
                mx-auto
                mb-3
                h-2
                w-2
                rounded-full
              "
              style={{
                background:
                  "var(--doba-green)",
                boxShadow:
                  "0 0 25px var(--doba-green)",
              }}
            />

            <p
              className="
                text-xs
                font-medium
                uppercase
                tracking-[0.3em]
                opacity-40
              "
            >
              Featured Artists
            </p>
          </div>
        </div>
      </div>

      {/* ================================
          MODAL
      ================================= */}
      {selectedImage && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/80
            p-4
            backdrop-blur-md
          "
          onClick={() =>
            setSelectedImage(null)
          }
        >
          <div
            className="
              relative
              w-full
              max-w-lg
              overflow-hidden
              rounded-2xl
              border
              border-white/10
              bg-black
              shadow-2xl
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="relative aspect-square">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="
                  h-full
                  w-full
                  object-cover
                "
              />

              <button
                type="button"
                onClick={() =>
                  setSelectedImage(null)
                }
                aria-label="Close"
                className="
                  absolute
                  right-3
                  top-3
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-black/60
                  text-white
                  backdrop-blur-md
                  transition
                  hover:bg-black
                "
              >
                <X size={18} />
              </button>
            </div>

            {(selectedImage.title ||
              selectedImage.description) && (
              <div className="p-5">
                {selectedImage.title && (
                  <h3 className="text-xl font-bold">
                    {selectedImage.title}
                  </h3>
                )}

                {selectedImage.description && (
                  <p className="mt-2 text-sm opacity-60">
                    {selectedImage.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default OrbitingCarousel;