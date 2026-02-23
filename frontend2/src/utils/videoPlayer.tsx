import { Box, Text } from "@mantine/core";

interface VideoPlayerProps {
  url: string;
}

export const VideoPlayer = ({ url }: VideoPlayerProps) => {
  const API_URL = import.meta.env.VITE_STATIC_URL;

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getLocalUrl = (url: string) => {
    const cleanUrl = url.trim();
    const cleanPath = cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`;
    return `${API_URL}${cleanPath}`;
  };

  if (!url) return <Text>No hay video disponible</Text>;

  const youtubeId = getYoutubeId(url);
  const isYoutube = !!youtubeId;
  const localUrl = getLocalUrl(url);

  return (
    <Box
      style={{
        position: "relative",
        paddingTop: "56.25%", // Aspect Ratio 16:9
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#000",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      }}
    >
      {isYoutube ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0&modestbranding=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      ) : (
        <video
          controls
          controlsList="nodownload"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source src={localUrl} type="video/mp4" />
          Tu navegador no soporta el elemento de video.
        </video>
      )}
    </Box>
  );
};
