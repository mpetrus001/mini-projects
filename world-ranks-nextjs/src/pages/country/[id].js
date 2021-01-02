import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./country.module.css";
import Layout from "../../components/Layout/Layout";

const getCountry = async (id) => {
  const response = await fetch(`https://restcountries.eu/rest/v2/alpha/${id}`);
  return await response.json();
};

export default function Country({ country }) {
  // console.log(country);
  const [borders, setBorders] = useState([]);

  useEffect(() => {
    const fetchBorders = country.borders.map((border) => getCountry(border));
    Promise.all(fetchBorders).then(setBorders);
  }, []);

  return (
    <Layout title={country.name}>
      <div className={styles.container}>
        <div className={styles.container_left}>
          <div className={styles.overview_panel}>
            <img src={country.flag} alt={country.name} />
            <h1 className={styles.overview_name}>{country.name}</h1>
            <div className={styles.overview_region}>{country.region}</div>
            <div className={styles.overview_numbers}>
              <div className={styles.overview_population}>
                <div className={styles.overview_value}>
                  {country.population}
                </div>
                <div className={styles.overview_label}>Population</div>
              </div>
              <div className={styles.overview_area}>
                <div className={styles.overview_value}>{country.area}</div>
                <div className={styles.overview_label}>Area</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.container_right}>
          {" "}
          <div className={styles.details_panel}>
            <h4 className={styles.details_heading}>Details</h4>
            <div className={styles.details_row}>
              <div className={styles.details_label}>Capital</div>
              <div className={styles.details_value}>{country.capital}</div>
            </div>
            <div className={styles.details_row}>
              <div className={styles.details_label}>Subregion</div>
              <div className={styles.details_value}>{country.subregion}</div>
            </div>
            <div className={styles.details_row}>
              <div className={styles.details_label}>Languages</div>
              <div className={styles.details_value}>
                {country.languages.map(({ name }) => name).join(", ")}
              </div>
            </div>
            <div className={styles.details_row}>
              <div className={styles.details_label}>Currencies</div>
              <div className={styles.details_value}>
                {country.currencies.map(({ name }) => name).join(", ")}
              </div>
            </div>
            <div className={styles.details_row}>
              <div className={styles.details_label}>Native Name</div>
              <div className={styles.details_value}>{country.nativeName}</div>
            </div>
            <div className={styles.details_row}>
              <div className={styles.details_label}>Gini</div>
              <div className={styles.details_value}>{country.gini} %</div>
            </div>
            <div className={styles.details_borders}>
              <div className={styles.details_borders_label}>Borders</div>
              <div className={styles.details_borders_countries}>
                {borders.map((country) => {
                  return (
                    <div className={styles.details_borders_country}>
                      <img src={country.flag} alt={country.name} />
                      <Link href={`/country/${country.alpha3Code}`}>
                        <div className={styles.details_borders_name}>
                          {country.name}
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async ({ params }) => {
  const country = await getCountry(params.id);
  return {
    props: {
      country,
    },
  };
};
