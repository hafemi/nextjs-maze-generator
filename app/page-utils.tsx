import styles from "./page.module.css";

export function inputBuilder(
  id: string,
  text: string,
  type: string,
  placeholder: string
): JSX.Element {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor={id}>{text}</label>
      <input type={type} id={id} name={id} placeholder={placeholder}></input>
    </div>
  );
}

export function dropdownBuilder(
  id: string,
  text: string,
  options: string[]
): JSX.Element {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor={id}>{text}</label>
      <select id={id}>
        {options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

export function buttonBuilder(
  id: string,
  text: string,
  onClick: () => void
): JSX.Element {
  return (
    <button
      className={styles.button}
      id={id}
      onClick={onClick}
    >
      {text}
    </button>
  );
}