import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

interface DynamicTabsProps {
    tabs: {
        label: string,
        value?: string,
        content: React.ReactNode
    }[]
}

export function DynamicTabs({ tabs }: DynamicTabsProps) {
  return (
    <Tabs defaultValue="account" className="md:w-[400px]">
      <TabsList className="grid w-full max-sm:grid-cols-2 grid-cols-4">
        {
            tabs.map((tab) => (
                <TabsTrigger 
                    key={tab.label} 
                    value={tab.value || tab.label}
                    className=""
                >
                {tab.label}
                </TabsTrigger>
            ))
        }
      </TabsList>
      {
        tabs.map((tab) => (
            <TabsContent key={tab.label} value={tab.value || tab.label}>
                <div className="flex flex-col p-3 gap-3">
                    {tab.content}
                </div>
            </TabsContent>
        ))
      }
    </Tabs>
  )
}
