export type ShareTargetFields = {
  title: string;
  text: string;
  url: string;
};

export type ShareIntakePayload = {
  url: string;
  title: string;
  autoParse: boolean;
};

export type StatusToastKind = "info" | "warning";

export type StatusToast = {
  kind: StatusToastKind;
  message: string;
};
