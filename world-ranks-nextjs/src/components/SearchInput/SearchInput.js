import styles from "./SearchInput.module.css";
import SearchRounded from "@material-ui/icons/SearchRounded";

export default function SearchInput({ ...rest }) {
  return (
    <div className={styles.wrapper}>
      <SearchRounded />
      <input className={styles.input} {...rest} />
    </div>
  );
}
