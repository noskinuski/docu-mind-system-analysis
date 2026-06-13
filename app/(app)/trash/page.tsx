"use client"

import { Trash2, RotateCcw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useDocs } from "@/hooks/use-documind"

export default function TrashPage() {
  const {
    deletedDocs,
    restoreDoc,
    permanentDeleteDoc,
  } = useDocs()

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold">
        🗑️ Sampah
      </h1>

      {deletedDocs.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Tidak ada file di sampah.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {deletedDocs.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-muted-foreground">
                    File terhapus
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="default"
                    onClick={() => restoreDoc(doc.id)}
                  >
                    <RotateCcw className="size-4" />
                    Pulihkan
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => permanentDeleteDoc(doc.id)}
                  >
                    <Trash2 className="size-4" />
                    Hapus Permanen
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}