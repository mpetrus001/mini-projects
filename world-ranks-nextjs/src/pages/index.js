import { useState } from "react";
import styles from "../styles/Home.module.css";
import Layout from "../components/Layout/Layout";
import SearchInput from "../components/SearchInput/SearchInput";
import CountriesTable from "../components/CountriesTable/CountriesTable";

export default function Home({ countries }) {
  const [keyword, setKeyword] = useState("");

  const onInputChange = (event) => {
    event.preventDefault();
    setKeyword(event.target.value.toLowerCase());
  };

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(keyword) ||
      country.region.toLowerCase().includes(keyword) ||
      country.subregion.toLowerCase().includes(keyword)
  );

  return (
    <Layout>
      <div className={styles.input_container}>
        <div className={styles.count}>
          Found {filteredCountries.length} countries
        </div>
        <div className={styles.input}>
          <SearchInput
            placeholder="Filter by Name, Region, or Subregion"
            onChange={onInputChange}
          />
        </div>
      </div>
      <CountriesTable countries={filteredCountries} />
    </Layout>
  );
}

export const getStaticProps = async () => {
  const response = await fetch("https://restcountries.eu/rest/v2/all");
  const countries = await response.json();
  return {
    props: {
      countries,
    },
  };
};
