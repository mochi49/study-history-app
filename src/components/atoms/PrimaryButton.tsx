import { Button } from "@chakra-ui/react";
import { memo, type FC } from "react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export const PrimaryButton: FC<Props> = memo((props) => {
  const { children, disabled = false, loading = false, onClick } = props;

  return (
    <Button
      variant={"outline"}
      bg={"blue.400"}
      color={"white"}
      _hover={{ opacity: 0.8 }}
      disabled={disabled || loading}
      onClick={onClick}
      // loading={loading}
    >
      {children}
    </Button>
  );
});
