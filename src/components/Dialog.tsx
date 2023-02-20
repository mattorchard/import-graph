import { ComponentProps, FunctionComponent } from "preact";
import { useEffect, useLayoutEffect, useRef } from "preact/hooks";

interface DialogProps extends Omit<ComponentProps<"dialog">, "open"> {
  isOpen: boolean;
  onClose?: (event: Event) => void;
  onCancel?: (event: Event) => void;
}
export const Dialog: FunctionComponent<DialogProps> = ({
  isOpen,
  onClose,
  onCancel,
  children,
  ...props
}) => {
  const ref = useRef<HTMLDialogElement>(undefined!);

  useLayoutEffect(() => {
    if (isOpen) ref.current.showModal();
    else ref.current.close();
  }, [isOpen]);

  useEffect(() => {
    if (!onClose) return () => {};
    const dialiog = ref.current;
    dialiog.addEventListener("close", onClose);
    return () => dialiog.removeEventListener("close", onClose);
  }, [onClose]);

  useEffect(() => {
    if (!onCancel) return () => {};
    const dialiog = ref.current;
    dialiog.addEventListener("cancel", onCancel);
    return () => dialiog.removeEventListener("cancel", onCancel);
  }, [onCancel]);

  return (
    <dialog {...props} ref={ref}>
      {children}
    </dialog>
  );
};
