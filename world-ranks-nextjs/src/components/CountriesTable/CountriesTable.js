import { useState } from "react";
import Link from "next/link";
import KeyboardArrowDownRounded from "@material-ui/icons/KeyboardArrowDownRounded";
import KeyboardArrowUpRounded from "@material-ui/icons/KeyboardArrowUpRounded";
import styles from "./CountriesTable.module.css";

const orderBy = (countries, value, direction) => {
  let newCountries = [...countries];
  if (direction == "ASC")
    return newCountries.sort((a, b) => (a[value] > b[value] ? 1 : -1));
  if (direction == "DESC")
    return newCountries.sort((a, b) => (a[value] > b[value] ? -1 : 1));
  return newCountries;
};

const SortArrow = ({ direction }) => {
  if (!direction) return <></>;
  if (direction == "DESC")
    return (
      <div className={styles.heading_arrow}>
        <KeyboardArrowDownRounded />
      </div>
    );
  if (direction == "ASC")
    return (
      <div className={styles.heading_arrow}>
        <KeyboardArrowUpRounded />
      </div>
    );
};

export default function CountriesTable({ countries }) {
  // console.log(countries[0]);
  const [direction, setDirection] = useState();
  const [value, setValue] = useState();

  const switchDirection = () => {
    if (!direction) {
      setDirection("DESC");
    } else if (direction == "DESC") {
      setDirection("ASC");
    } else {
      setDirection(null);
    }
  };

  const setValueAndDirection = (value) => {
    switchDirection();
    setValue(value);
  };

  const orderedCountries = orderBy(countries, value, direction);

  return (
    <div>
      <div className={styles.heading}>
        <div className={styles.heading_flag}></div>
        <button
          className={styles.heading_name}
          onClick={() => setValueAndDirection("name")}
        >
          <div>Name</div>
          <SortArrow direction={value == "name" ? direction : null} />
        </button>
        <button
          className={styles.heading_population}
          onClick={() => setValueAndDirection("population")}
        >
          <div>Population</div>
          <SortArrow direction={value == "population" ? direction : null} />
        </button>
        <button
          className={styles.heading_area}
          onClick={() => setValueAndDirection("area")}
        >
          <div>
            Area (km<sup style={{ fontSize: "0.5rem" }}>2</sup>)
          </div>
          <SortArrow direction={value == "area" ? direction : null} />
        </button>
        <button
          className={styles.heading_gini}
          onClick={() => setValueAndDirection("gini")}
        >
          <div>Gini</div>
          <SortArrow direction={value == "gini" ? direction : null} />
        </button>
      </div>
      {orderedCountries.map((country) => {
        return (
          <Link
            href={`/country/${country.alpha3Code}`}
            key={country.alpha3Code}
          >
            <div className={styles.row}>
              <div className={styles.flag}>
                <img src={country.flag} alt={country.name} />
              </div>
              <div className={styles.name}>{country.name}</div>
              <div className={styles.population}>{country.population}</div>
              <div className={styles.area}>{country.area || 0}</div>
              <div className={styles.gini}>{country.gini || 0} %</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
