// MENAMPILKAN ITEM DETAILS PRODUCTS
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { IconButton, Box, Typography, Button, Tabs, Tab } from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { shades } from "../../theme";
import { addToCart } from "../../state";
import { useParams } from "react-router-dom";
import Item from "../../components/Item";
import { BsCart4 } from "react-icons/bs";

const ItemDetails = () => {
  const dispatch = useDispatch();
  const { itemId } = useParams(); // Mengambil nilai params itemId dari Item.jsx
  const [value, setValue] = useState("description");
  const [count, setCount] = useState(1);
  const [item, setItem] = useState(null);
  const [items, setItems] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // MENGAMBIL FUNGSI DATA itemId KETIKA IMAGE DIKLIK
  async function getItem() {
    try {
      const response = await fetch(
        `http://localhost:1337/api/items/${itemId}?populate=image`,
        { method: "GET" }
      );
      const itemJson = await response.json();
      console.log("Fetched item:", itemJson); // Debugging
      setItem(itemJson.data);
    } catch (error) {
      console.error("Error fetching item:", error);
    }
  }

  // MENGAMBIL FUNGSI ITEMS YANG MENGAMBIL DATA DARI item.jsx
  async function getItems() {
    try {
      const response = await fetch(
        "http://localhost:1337/api/items?populate=image",
        { method: "GET" }
      );
      const itemsJson = await response.json();
      console.log("Fetched items:", itemsJson); // Debugging
      setItems(itemsJson.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }

  // PENGAMBILAN DATA API
  useEffect(() => {
    getItem();
    getItems();
  }, [itemId]); // eslint-disable-line react-hooks/exhaustive-deps

  // FUNGSI FORMAT RUPIAH
  function formatRupiah(number) {
    if (number === undefined) {
      return "0"; // Atau nilai default lain sesuai kebutuhan Anda
    }
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  return (
    <Box width="80%" m="80px">
      <Box
        display="flex"
        flexWrap="nowrap"
        columnGap="40px"
        justifyContent="flex-start"
      >
        {/* IMAGES */}
        <Box flex="1 1 40%" mb="40px">
          {item?.attributes?.image?.data?.attributes?.formats?.medium?.url && (
            <img
              alt={item?.attributes?.name}
              width="100%"
              height="100%"
              src={`http://localhost:1337${item.attributes.image.data.attributes.formats.medium.url}`}
              style={{ objectFit: "contain" }}
            />
          )}
        </Box>

        {/* ACTIONS */}
        <Box flex="1 1 60%">
          {/* <Box display="flex" justifyContent="space-between">
            <Box>Home/Item</Box>
            <Box display="flex" justifyContent="space-between">
             
              <Box>Preview Next</Box>
             
            </Box>
          </Box> */}
          <Box m="5px 0 25px 0">
            <Typography variant="h3">{item?.attributes?.name}</Typography>
            {/* <Typography>Rp {item?.attributes?.price}K</Typography> */}
            <Typography fontWeight="bold" variant="h6" sx={{ mt: 1, mb: 1 }}>
              Rp {formatRupiah(item?.attributes?.price)}K
            </Typography>

            <Typography sx={{ mt: "20px" }}>
              {item?.attributes?.longDescription[0]?.children[0]?.text}
            </Typography>
          </Box>

          {/* COUNT AND BUTTON */}
          <Box display="flex" alignItems="center" minHeight="50px">
            <Box
              display="flex"
              alignItems="center"
              border={`1.5px solid ${shades.neutral[300]}`}
              mr="20px"
              p="2px 5px"
            >
              <IconButton onClick={() => setCount(Math.max(count - 1, 1))}>
                <RemoveIcon />
              </IconButton>
              <Typography sx={{ p: "0 5px" }}>{count}</Typography>
              <IconButton onClick={() => setCount(count + 1)}>
                <AddIcon />
              </IconButton>
            </Box>

            {/* BUTTON */}
            <Button
              sx={{
                backgroundColor: "#222222",
                color: shades.neutral[300],
                borderRadius: 0,
                minWidth: "100px",
                padding: "10px 40px",
                "&:hover": {
                  backgroundColor: shades.primary[300],
                },
              }}
              onClick={() => dispatch(addToCart({ item: { ...item, count } }))}
            >
              {/* icon keranjang */}
              <BsCart4 size={25} />
            </Button>
          </Box>

          <Box m="20px 0 5px 0" display="flex">
            <FavoriteBorderOutlinedIcon />
            <Typography sx={{ ml: "5px" }}>ADD TO WISHLIST</Typography>
          </Box>

          <Typography sx={{ mt: 3, mb: 1 }}>
            CATEGORIES: {item?.attributes?.category}
          </Typography>
        </Box>
      </Box>

      {/* INFORMATION */}
      <Box m="20px 0">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="DESCRIPTION" value="description" />
          <Tab label="REVIEWS" value="reviews" />
        </Tabs>
      </Box>
      <Box display="flex" flexWrap="wrap" gap="15px">
        {value === "description" && (
          <Typography>
            {item?.attributes?.longDescription[0]?.children[0]?.text}
          </Typography>
        )}
        {value === "reviews" && <div>reviews</div>}
      </Box>

      {/* RELATED ITEMS */}
      <Box mt="50px" width="100%">
        <Typography
          variant="h3"
          textAlign="center"
          sx={{ fontWeight: "normal" }}
        >
          Related <span style={{ fontWeight: "bold" }}>Products</span>
        </Typography>

        {/* MENGAMBIL IMAGE DARI item.jsx */}
        <Box
          mt="50px"
          display="flex"
          // gridTemplateColumns="repeat(auto-fit, minmax(50px, 1fr))"
          columnGap="1.33%"
          alignItems="center"
          justifyContent="space-between"
          justifyItems="center"
          flexWrap="nowrap"
        >
          {items.slice(0, 4).map((relatedItem, i) => (
            <Item
              key={`${relatedItem.attributes.name}-${i}`}
              item={relatedItem}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ItemDetails;
