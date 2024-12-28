import Button from "../Button";
import { Icon } from "@iconify/react";

type paginationProps = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (currentPage: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: paginationProps) {
  return (
    <div className="flex items-center w-full my-8 max-w-96 justify-start space-x-2">
      <Button
        title={<Icon icon="eva:arrow-ios-back-fill" width={20} height={20} />}
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      />

      <span className="text-sm w-full text-center">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        title={
          <Icon icon="eva:arrow-ios-forward-fill" width={20} height={20} />
        }
        variant="outline"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      />
    </div>
  );
}
