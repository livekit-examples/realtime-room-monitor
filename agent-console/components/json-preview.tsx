import JsonView from "@uiw/react-json-view";
import { githubLightTheme } from "@uiw/react-json-view/githubLight";
import { vscodeTheme } from "@uiw/react-json-view/vscode";
import { useTheme } from "next-themes";
import { ScrollArea } from "./ui/scroll-area";

type PreviewableDataType = object | string | number | boolean | null | undefined;

const convertToJson = (data: PreviewableDataType) => {
  if (data === null || data === undefined) {
    return {};
  }

  if (typeof data === "object") {
    return data;
  }

  return {
    data: data,
  };
};

const useJsonPreviewTheme = () => {
  const { theme } = useTheme();
  return theme === "dark" ? vscodeTheme : githubLightTheme;
};

export const JsonPreview = ({ title, data }: { title: string; data: PreviewableDataType }) => {
  const theme = useJsonPreviewTheme();

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">{title}</h4>
      {data && (
        <ScrollArea orientation="horizontal">
          <JsonView collapsed={1} className="p-2" value={convertToJson(data)} style={theme} />
        </ScrollArea>
      )}
      {!data && (
        <div className="text-sm text-muted-foreground italic">No {title.toLowerCase()}</div>
      )}
    </div>
  );
};
