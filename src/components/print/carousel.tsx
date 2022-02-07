import Carousel from "react-material-ui-carousel";

interface Props {
  images: string[];
}

const LabelCarousel = ({ images }: Props) => {
  return (
    <Carousel
      autoPlay={false}
      animation="slide"
      index={0}
      navButtonsAlwaysVisible
      indicatorContainerProps={{
        style: {
          marginTop: "0px",
        },
      }}
      indicatorIconButtonProps={{
        style: {
          padding: "2px",
          color: "hsl(215, 28%, 30%)",
        },
      }}
      activeIndicatorIconButtonProps={{
        style: {
          color: "#29b6f6",
        },
      }}
      navButtonsProps={{
        style: {
          backgroundColor: "hsl(215, 28%, 30%)",
          color: "#29b6f6",
          display: false ? "none" : "block",
        },
      }}
    >
      {!images
        ? "No Image Found"
        : images.map((image) => (
            <div key={image} className="image-wrapper">
              <img style={{ height: "8rem" }} alt="label preview" src={`data:image/png;base64,${image}`} />
            </div>
          ))}
    </Carousel>
  );
};

export default LabelCarousel;
