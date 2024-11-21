export function Flex(props) {
  return <div style={{ display: "flex", ...props }}>{props.children}</div>;
}
