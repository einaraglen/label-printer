import { Box } from "@mui/material";
import Carousel from "react-material-ui-carousel";

interface Props {
  images: string[];
  index: number;
}

const LabelCarousel = ({ images, index }: Props) => {
  return (
    <Carousel
    className="unselectable flexGrow"
      autoPlay={false}
      animation="slide"
      index={index}
      navButtonsAlwaysVisible
      indicatorContainerProps={{
        style: {
          marginTop: "0px",
        },
      }}
      indicatorIconButtonProps={{
        style: {
          padding: "2px",
          color: "hsl(213, 27%, 44%)",
        },
      }}
      activeIndicatorIconButtonProps={{
        style: {
          color: "hsl(213, 27%, 84%)",
        },
      }}
      navButtonsProps={{
        style: {
          width: "50px",
          height: "50px",
          backgroundColor: "hsl(215, 28%, 30%)",
          color: "#cbd5e1",
          display: images.length === 1 ? "none" : "block",
        },
      }}
    >
      {images.map((image: string, idx: number) => (
        <Box key={idx} sx={{ display: "flex" }} className="unselectable" >
          <img style={{ height: "8rem", margin: "auto" }} className="unselectable" alt="label preview" src={`data:image/png;base64,${image}`} />
        </Box>
      ))}
    </Carousel>
  );
};

export default LabelCarousel;
