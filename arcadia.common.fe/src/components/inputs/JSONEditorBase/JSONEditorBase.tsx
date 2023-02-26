import React from 'react';
import AceEditor from 'react-ace';
import { IAceEditorProps } from 'react-ace/lib/ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';
import './JSONEditorBase.scss';

export interface IJSONEditorBaseProps extends IAceEditorProps {
}

export const JSONEditorBase: React.FC<IJSONEditorBaseProps> = ({ editorProps, setOptions, ...restProps }) => (
  <AceEditor
    className="json-editor"
    mode="json"
    theme="monokai"
    placeholder="Please type in JSON"
    showGutter={false}
    editorProps={{
      $blockScrolling: true,
      ...editorProps,
    }}
    setOptions={{
      printMarginColumn: 250,
      ...setOptions,
    }}
    {...restProps}
  />
);
