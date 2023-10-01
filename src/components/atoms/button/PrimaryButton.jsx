import { memo } from "react";
import { Button} from "@chakra-ui/react";

export const PrimaryButton = memo((props) => {
    const { children, onClick, disabled = false, loading = false } = props;
    return (
        <Button 
            bg="teal.400" 
            color="white" 
            _hover={{ opacity: 0.8 }} 
            disabled={disabled || loading}
            isLoading={loading}
            onClick={onClick}>
            { children }
        </Button>       
        );
});