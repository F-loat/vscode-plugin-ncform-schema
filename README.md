# vscode-plugin-ncform-schema

> ncform schema editor plugin for vscode

## 安装

插件商店搜索 `ncform` 后安装即可

## 功能

* 可视化编辑

  - 点击 `JSON` 文件右上角工具栏图标

  - 按下 `Ctrl + Shift + P` 后输入 `ncform` 执行相关命令

  - 右键 `JSON` 文件点击 `Open With...` 后选择 `NcForm Schema Editor`

* 代码智能提示

  - 默认对 `schemas?` 文件夹内的 `JSON` 文件生效
  
  - [自定义关联规则](https://code.visualstudio.com/Docs/languages/json#_json-schemas-and-settings)

``` json
{
  "$schema": "https://raw.githubusercontent.com/F-loat/vscode-plugin-ncform-schema/master/src/validation/schema.json"
}
```
