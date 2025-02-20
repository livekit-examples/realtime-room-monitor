"use client";

import { cn } from "@/lib/utils";
import Editor, { useMonaco } from "@monaco-editor/react";
import { CircleAlert } from "lucide-react";
import { editor } from "monaco-editor";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const darkEditorTheme: editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [],
  colors: {
    "editor.background": "#09090b",
  },
};

interface JsonEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const JsonEditor = ({ value = "{}", onChange, className }: JsonEditorProps) => {
  const { theme } = useTheme();
  const monaco = useMonaco();
  const [isValid, setIsValid] = useState(true);
  const [localValue, setLocalValue] = useState(value);
  const [lineCount, setLineCount] = useState(1);
  const lineHeight = 19; // Monaco's default line height
  const padding = 30;

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("customDarkTheme", darkEditorTheme);
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [],
        allowComments: false,
        enableSchemaRequest: true,
      });
    }
  }, [monaco]);

  useEffect(() => {
    const lines = localValue.split("\n").length;
    setLineCount(Math.max(lines, 1));
  }, [localValue]);

  const editorHeight = Math.min(Math.max(lineCount * lineHeight + padding, 50), 300);

  const handleValidate = (markers: editor.IMarker[]) => {
    setIsValid(markers.length === 0);
  };

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      <div style={{ height: editorHeight }}>
        <Editor
          defaultLanguage="json"
          language="json"
          theme={theme === "dark" ? "customDarkTheme" : "vs-light"}
          value={localValue}
          options={{
            minimap: { enabled: false },
            formatOnPaste: true,
            formatOnType: true,
            autoClosingBrackets: "always",
            scrollBeyondLastLine: true,
            lineNumbers: "on",
            roundedSelection: false,
            automaticLayout: true,
          }}
          onChange={(val) => {
            setLocalValue(val || "");
          }}
          onValidate={handleValidate}
          beforeMount={(monaco) => {
            monaco.editor.defineTheme("customDarkTheme", darkEditorTheme);
          }}
          height={editorHeight + "px"}
        />
      </div>
      {!isValid && (
        <div className="animate-in fade-in slide-in-from-bottom-2">
          <div className="rounded-lg border border-red-500/50 bg-red-50 px-4 py-3 text-red-600">
            <div className="flex gap-3">
              <CircleAlert
                className="mt-0.5 shrink-0 opacity-60"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              <div className="grow space-y-1">
                <p className="text-sm font-medium">Invalid JSON structure:</p>
                <ul className="list-inside list-disc text-sm opacity-80">
                  <li>Check for proper quotation marks</li>
                  <li>Verify all commas are in place</li>
                  <li>Ensure proper bracket alignment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
