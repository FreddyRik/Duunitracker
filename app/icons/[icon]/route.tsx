import { createPwaIconResponse } from "@/app/pwa-icon-response";

const ICONS = {
  "icon-192": { size: 192, maskable: false },
  "icon-512": { size: 512, maskable: false },
  "icon-512-maskable": { size: 512, maskable: true },
} as const;

type IconName = keyof typeof ICONS;

function isIconName(value: string): value is IconName {
  return Object.prototype.hasOwnProperty.call(ICONS, value);
}

export function generateStaticParams(): { icon: IconName }[] {
  return (Object.keys(ICONS) as IconName[]).map((icon) => ({ icon }));
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ icon: string }> },
) {
  const { icon } = await context.params;
  if (!isIconName(icon)) {
    return new Response("Not found", { status: 404 });
  }

  const spec = ICONS[icon];
  return createPwaIconResponse(spec.size, spec.maskable);
}
