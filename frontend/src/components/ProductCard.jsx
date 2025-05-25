import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Select,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useProductStore } from "../store/product";

const ProductCard = ({ product }) => {
  const [updatedProduct, setUpdatedProduct] = useState(product);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const cancelRef = useRef();

  const textColor = useColorModeValue("gray.600", "gray.200");
  const bg = useColorModeValue("white", "gray.800");

  const { deleteProduct, updateProduct } = useProductStore();
  const toast = useToast();
  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useDisclosure();

  const {
    isOpen: isOrderOpen,
    onOpen: onOrderOpen,
    onClose: onOrderClose,
  } = useDisclosure();

  const [orderDetails, setOrderDetails] = useState({
    name: "",
    address: "",
    pincode: "",
    landmark: "",
    paymentMethod: "",
  });

  const handleDeleteProduct = async (pid) => {
    const { success, message } = await deleteProduct(pid);
    toast({
      title: success ? "Success" : "Error",
      description: message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleUpdateProduct = async (pid, updatedProduct) => {
    const { success } = await updateProduct(pid, updatedProduct);
    onUpdateClose();
    toast({
      title: success ? "Success" : "Error",
      description: success
        ? "Product updated successfully"
        : "Failed to update product",
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleOrderSubmit = async () => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          ...orderDetails,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Order failed");
      }

      toast({
        title: "Order Placed!",
        description: data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onOrderClose();
      setOrderDetails({
        name: "",
        address: "",
        pincode: "",
        landmark: "",
        paymentMethod: "",
      });
    } catch (err) {
      toast({
        title: "Failed to place order",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
      bg={bg}
    >
      <Image
        src={product.image}
        alt={product.name}
        h={48}
        w="full"
        objectFit="cover"
      />

      <Box p={4}>
        <Heading as="h3" size="md" mb={2}>
          {product.name}
        </Heading>

        <Text fontWeight="bold" fontSize="xl" color={textColor} mb={4}>
          ₹{product.price}
        </Text>

        <HStack spacing={2}>
          <IconButton icon={<EditIcon />} onClick={onUpdateOpen} colorScheme="blue" />
          <IconButton
            icon={<DeleteIcon />}
            onClick={() => {
              setProductToDelete(product._id);
              setIsConfirmOpen(true);
            }}
            colorScheme="red"
          />
          <Button colorScheme="green" size="sm" onClick={onOrderOpen}>
            Order Now
          </Button>
        </HStack>
      </Box>

      {/* Update Modal */}
      <Modal isOpen={isUpdateOpen} onClose={onUpdateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Product Name"
                name="name"
                value={updatedProduct.name}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, name: e.target.value })
                }
              />
              <Input
                placeholder="Price"
                name="price"
                type="number"
                value={updatedProduct.price}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, price: e.target.value })
                }
              />
              <Input
                placeholder="Image URL"
                name="image"
                value={updatedProduct.image}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, image: e.target.value })
                }
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleUpdateProduct(product._id, updatedProduct)}
            >
              Update
            </Button>
            <Button variant="ghost" onClick={onUpdateClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isConfirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsConfirmOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Product
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={async () => {
                  await handleDeleteProduct(productToDelete);
                  setIsConfirmOpen(false);
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Order Modal */}
      <Modal isOpen={isOrderOpen} onClose={onOrderClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Place Your Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Enter your name"
                value={orderDetails.name}
                onChange={(e) =>
                  setOrderDetails({ ...orderDetails, name: e.target.value })
                }
              />
              <Input
                placeholder="Your address"
                value={orderDetails.address}
                onChange={(e) =>
                  setOrderDetails({ ...orderDetails, address: e.target.value })
                }
              />
              <Input
                placeholder="PIN code"
                value={orderDetails.pincode}
                onChange={(e) =>
                  setOrderDetails({ ...orderDetails, pincode: e.target.value })
                }
              />
              <Input
                placeholder="Landmark near your address"
                value={orderDetails.landmark}
                onChange={(e) =>
                  setOrderDetails({ ...orderDetails, landmark: e.target.value })
                }
              />
              <Select
                placeholder="Select payment method"
                value={orderDetails.paymentMethod}
                onChange={(e) =>
                  setOrderDetails({ ...orderDetails, paymentMethod: e.target.value })
                }
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="UPI">UPI</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
              </Select>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleOrderSubmit}>
              Submit Order
            </Button>
            <Button variant="ghost" onClick={onOrderClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProductCard;
