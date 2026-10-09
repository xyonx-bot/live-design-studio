import Button from "./Button";

export default function ButtonPreview() {
  return (
    <div className="flex flex-col items-start gap-8 p-10">
      <div className="flex flex-wrap items-center gap-4">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button>Hover me</Button>
        <Button disabled className="opacity-50 cursor-not-allowed">
          Disabled
        </Button>
        <Button className="rounded-none">Squircle off</Button>
      </div>
    </div>
  );
}
