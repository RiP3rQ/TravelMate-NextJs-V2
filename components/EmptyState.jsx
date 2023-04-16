import { useRouter } from "next/navigation";
import Heading from "./modals/Heading";
import Button from "./modals/Button";

const EmptyState = ({
  title = "Nie znaleziona dopasowań!",
  subtitle = "Zmień lub usuń zastosowane filtry",
  showReset,
}) => {
  const router = useRouter();

  return (
    <div className="h-[60vh] flex flex-col gap-2 justify-center items-center">
      <Heading center title={title} subtitle={subtitle} />
      <div className="w-48 mt-4">
        {showReset && (
          <Button
            outline
            label="Usuń filtry"
            onClick={() => router.push("/search")}
          />
        )}
      </div>
    </div>
  );
};

export default EmptyState;
