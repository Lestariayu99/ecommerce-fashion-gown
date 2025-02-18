// MENAMPILKAN IMAGE, ADD TO CART
import { useState } from "react";
import { useDispatch } from "react-redux";
import { IconButton, Box, Typography, useTheme, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { shades } from "../theme";
import { addToCart } from "../state";
import { useNavigate } from "react-router-dom";
import { BsCart4 } from "react-icons/bs";

const Item = ({ item, width }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [isHover, setIsHovered] = useState(false);
  const {
    palette: { neutral },
  } = useTheme();
  // eslint-disable-next-line
  const { category, price, name, image } = item.attributes || {};
  const url = image?.data?.attributes?.formats?.medium?.url;

  // FUNGSI FORMAT RUPIAH
  function formatRupiah(number) {
    if (number === undefined) {
      return "0"; // Atau nilai default lain sesuai kebutuhan Anda
    }
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  return (
    <Box width={width}>
      <Box
        position="relative"
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
      >
        {url && (
          <img
            alt={name}
            width="300px"
            height="400px"
            src={`http://localhost:1337${url}`}
            onClick={() => navigate(`/item/${item.id}`)}
            style={{ cursor: "pointer" }}
          />
        )}

        <Box
          display={isHover ? "block" : "none"}
          position="absolute"
          bottom="10%"
          left="0"
          width="100%"
          padding="0 5%"
        >
          <Box display="flex" justifyContent="space-between">
            {/* AMOUNT */}
            <Box
              display="flex"
              alignItems="center"
              backgroundColor={shades.neutral[100]}
              borderRadius="3px"
            >
              <IconButton onClick={() => setCount(Math.max(count - 1, 1))}>
                <RemoveIcon />
              </IconButton>
              <Typography color={shades.primary[300]}>{count}</Typography>
              <IconButton onClick={() => setCount(count + 1)}>
                <AddIcon />
              </IconButton>
            </Box>

            {/* BUTTON */}
            <Button
              onClick={() => {
                dispatch(addToCart({ item: { ...item, count } }));
              }}
              sx={{ backgroundColor: shades.primary[300], color: "white" }}
            >
              {/* icon keranjang */}
              <BsCart4 size={25} />
            </Button>
          </Box>
        </Box>
      </Box>

      <Box mt="3px">
        <Typography variant="subtitle2" color={neutral.dark}>
          {category
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())}
        </Typography>
        <Typography>{name}</Typography>
        <Typography fontWeight="bold">
          Rp {formatRupiah(item?.attributes?.price)}K
        </Typography>
      </Box>
    </Box>
  );
};

export default Item;
