import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card'
import { Button } from './Button'

export default function CardPreview() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Card</h2>
      <p className="text-muted-foreground">A flexible card component for displaying content.</p>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Default</h3>
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here with some additional context.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">This is the card content. You can put any content here including text, images, or other components.</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="ghost" size="sm">Cancel</Button>
              <Button size="sm">Save</Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Simple Card</h3>
          <Card className="w-full max-w-sm">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">A simple card with just content.</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Card Grid</h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-full">
                <CardHeader>
                  <CardTitle>Card {i}</CardTitle>
                  <CardDescription>Description for card {i}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Content for card {i} goes here.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">Action</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Dark Mode</h3>
          <div className="dark p-4 rounded-lg">
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle>Dark Mode Card</CardTitle>
                <CardDescription>This card renders in dark mode.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Content looks good in both light and dark themes.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}