import { Fragment, FunctionComponent } from "preact";
import { useCallback, useState } from "preact/hooks";
import { isNotNullish } from "../helpers/CollectionHelpers";
import { AliasMap } from "../utilities/ImportResolver";
import { Dialog } from "./Dialog";

export const AliasDialog: FunctionComponent<{
  isOpen: boolean;
  aliases: AliasMap;
  onChange: (value: AliasMap) => void;
  onClose: () => void;
}> = ({ isOpen, aliases, onChange, onClose }) => {
  const [draftAliasMap, setDraftAliasMap] = useState(aliases);
  const handleClose = useCallback(() => {
    onChange(draftAliasMap);
    onClose();
  }, [onChange, onClose, draftAliasMap]);

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} className="alias-dialog">
      <form className="alias-dialog__form" method="dialog">
        <label className="alias-dialog__label">
          Root Aliases
          <textarea
            className="alias-dialog__textarea"
            onInput={(e) => {
              const value = e.currentTarget.value;
              setDraftAliasMap(parseAliasMap(value));
            }}
          />
        </label>
        <label className="alias-dialog__label">
          Preview:
          <output>
            <dl className="alias-dialog__output-dl">
              {[...draftAliasMap].map(([from, to], index) => (
                <Fragment key={index}>
                  <dt>
                    <code>{from}</code>
                  </dt>
                  <dd>
                    <code>{to.join("/")}</code>
                  </dd>
                </Fragment>
              ))}
            </dl>
          </output>
        </label>
        <button type="submit">Save and close</button>
      </form>
    </Dialog>
  );
};

const parseAliasLine = (line: string) => {
  const groups = line.match(/^([^:/]+):(.+)$/);
  if (!groups) return null;
  const [, original, replacement] = groups;
  return [original, replacement.split("/").filter(Boolean)] as const;
};

const parseAliasMap = (aliasText: string): AliasMap =>
  new Map(
    aliasText
      .split("\n")
      .map((rawLine) => rawLine.trim())
      .map(parseAliasLine)
      .filter(isNotNullish)
  );
