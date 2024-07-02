// MENAMPILKAN KATEGORI ALL ITEMS, TOP RATED, BEST SELLER, NEW ARRIVALS, GOWN, BAGS
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Tab, Tabs, useMediaQuery } from "@mui/material";
import Item from "../../components/Item";
import { setItems } from "../../state";

const ShoppingList = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState("all");
  const items = useSelector((state) => state.cart.items);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  // const breakPoint = useMediaQuery("(min-width:600px)");
  console.log("items", items);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //   MENGAMBIL DATA DARI DATABASE STRAPI
  async function getItems() {
    const items = await fetch(
      // "http://localhost:1337/api/items?populate=image",
      "http://localhost:1337/api/items?populate=image&_limit=-1",
      { method: "GET" }
    );

    const itemsJson = await items.json();
    dispatch(setItems(itemsJson.data));
  }

  // FUNGSI MEGAMBIL DATA ARRAY API STRAPI
  useEffect(() => {
    getItems();
  }, []);
  // eslint-disable-line react-hooks/exhaustive-deps

  // MENGAMBIL DATA DARI DATABASE STRAPI DAN MEMFILTER KATEGORI
  const topRatedItems = items.filter(
    (item) => item.attributes.category === "topRated"
  );
  const newArrivalsItems = items.filter(
    (item) => item.attributes.category === "newArrivals"
  );
  const bestSellersItems = items.filter(
    (item) => item.attributes.category === "bestSellers"
  );
  const gownItems = items.filter((item) => item.attributes.category === "gown");
  const bagsItems = items.filter((item) => item.attributes.category === "bags");

  return (
    // MEMBUAT JUDUL PRODUCT START
    <Box width="95%" margin="80px auto">
      <Typography variant="h3" textAlign="center">
        Our Featured <b>Products</b>
      </Typography>

      {/* TABS ADALAH KOMPONENT DASAR DARI MATERIAL UNTUK PERGESERAN CEPAT DI FILTER */}
      <Tabs
        textColor="primary"
        indicatorColor="primary"
        value={value}
        onChange={handleChange}
        centered
        TabIndicatorProps={{ sx: { display: isNonMobile ? "block" : "none" } }}
        sx={{
          m: "25px",
          "& .MuiTabs-flexContainer": {
            flexWrap: "wrap",
          },
        }}
      >
        {/* MENAMPILKAN DBS KE UI */}
        <Tab label="ALL ITEMS" value="all" />
        <Tab label="NEW ARRIVALS" value="newArrivals" />
        <Tab label="BEST SELLERS" value="bestSellers" />
        <Tab label="TOP RATED" value="topRated" />
        <Tab label="GOWN" value="gown" />
        <Tab label="BAGS" value="bags" />
      </Tabs>
      {/* MEMBUAT JUDUL PRODUCT END */}

      <Box
        margin="0 auto"
        display="grid"

        gridTemplateColumns="repeat(auto-fill, 300px)"
        justifyContent="space-around"
        rowGap="20px"
        columnGap="1.33%"
      >
        {/* MENGAMBIL NILAI YANG ADA DI DATABASE */}
        {value === "all" &&
          items.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} />
          ))}
        {value === "newArrivals" &&
          newArrivalsItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} />
          ))}
        {value === "bestSellers" &&
          bestSellersItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} />
          ))}
        {value === "topRated" &&
          topRatedItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} />
          ))}
        {value === "gown" &&
          gownItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} />
          ))}
        {value === "bags" &&
          bagsItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} />
          ))}
      </Box>
    </Box>
  );
};
export default ShoppingList;
