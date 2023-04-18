import Image from "next/image";
import React from "react";

const ReviewCard = ({ review }) => {
  return (
    <div>
      <h1>{review.title}</h1>
      <p>{review.description}</p>
      <p>{review.star}</p>
      {review.imageSrc && (
        <Image src={review.imageSrc} width={100} height={100} />
      )}
    </div>
  );
};

export default ReviewCard;
