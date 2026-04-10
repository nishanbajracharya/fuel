export type H1Props = React.ComponentProps<'h1'>;

function H1({ className, ...props }: H1Props) {
  return (
    <h1
      className={`scroll-m-20 text-4xl font-extrabold tracking-tight text-balance ${className}`}
    >
      {props.children}
    </h1>
  );
}

export { H1 };
