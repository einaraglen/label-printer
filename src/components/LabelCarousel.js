import React from "react";
import Carousel from "react-material-ui-carousel";
import ReportProblemIcon from '@material-ui/icons/ReportProblem';

const LabelCarousel = ({ images, isPrinting, index, noTemplate }) => {

    return (
        <>
            {noTemplate ? (
                <div className="image-error">
                    <p>Select Template</p>
                    <ReportProblemIcon color="secondary" />
                </div>
            ) : (
                <Carousel
                    autoPlay={false}
                    animation="slide"
                    disabled
                    index={!index ? 0 : index}
                    navButtonsAlwaysVisible
                    indicatorContainerProps={{
                        style: {
                            pointerEvents: isPrinting ? "none" : "",
                            marginTop: "0px",
                        },
                    }}
                    indicatorIconButtonProps={{
                        style: {
                            pointerEvents: isPrinting ? "none" : "",
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
                            display: isPrinting ? "none" : "block",
                        },
                    }}
                >
                    {!images
                        ? "No Image Found"
                        : images.map((image) => (
                              <div key={image} className="image-wrapper">
                                  <img
                                      style={{ height: "8rem" }}
                                      alt="label preview"
                                      src={`data:image/png;base64,${image}`}
                                  />
                              </div>
                          ))}
                </Carousel>
            )}
        </>
    );
};

export default LabelCarousel;
