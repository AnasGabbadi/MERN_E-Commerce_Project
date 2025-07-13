import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import { Box } from "@mui/system";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/product`);
        console.log(`${import.meta.env.BASE_URL}/product`);

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(true);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <Box>Error loading products.</Box>;
  }

  return (
    <Container sx={{ mt:5 }}>
      <Grid container spacing={4}>
        {products.map((p) => (
          <Grid size={{xs:12, sm:6, md:4}}>
            <ProductCard {...p}/>
          </Grid> 
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;