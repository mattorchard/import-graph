import { FunctionComponent } from "preact";
import { useMemo } from "preact/hooks";
import { QueryRecord } from "../helpers/SearchHelpers";
import { countChar, isValidRegex, segmentLines } from "../helpers/TextHelpers";
import { createDebounced } from "../helpers/TimingHelpers";

export const SearchForm: FunctionComponent<{
  onChange: (queries: QueryRecord) => void;
}> = ({ onChange }) => {
  const onChangeHandlers = useMemo(
    () =>
      createDebounced((form: HTMLFormElement) => {
        const formData = new FormData(form);
        onChange({
          start: (formData.get("start") as string) || "",
          anywhere: (formData.get("anywhere") as string) || "",
          end: (formData.get("end") as string) || "",
        });
      }, 300),
    [onChange],
  );
  return (
    <form
      className="search-form"
      onSubmit={(e) => {
        e.preventDefault();
        onChangeHandlers.immediate(e.currentTarget);
      }}
      onBlur={(e) => onChangeHandlers.immediate(e.currentTarget)}
      onChange={(e) => onChangeHandlers.immediate(e.currentTarget)}
      onInput={(e) => onChangeHandlers.debounced(e.currentTarget)}
    >
      <SearchInput label="Start" />
      <SearchInput label="Anywhere" />
      <SearchInput label="End" />
    </form>
  );
};

const SearchInput: FunctionComponent<{ label: string }> = ({ label }) => (
  <textarea
    className="search-form__search-input"
    name={label.toLowerCase()}
    aria-label={label}
    placeholder={label}
    onInput={(e) => {
      const { value, style } = e.currentTarget;
      const lineCount = 1 + countChar(value, "\n");
      style.setProperty("--line-count", lineCount.toString());

      const segments = segmentLines(value);
      const containsInvalidRegex = segments.some((seg) => !isValidRegex(seg));
      e.currentTarget.setCustomValidity(
        containsInvalidRegex ? "Invalid regex" : "",
      );
    }}
  />
);
