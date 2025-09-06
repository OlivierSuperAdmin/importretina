import React, { useState } from 'react';
import ApiDocumentation from './ApiDocumentation';
import ExcelToJsonConverter from './ExcelToJsonConverter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FileText, FileSpreadsheet } from 'lucide-react';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('api-doc');

  return (
    <div className="min-h-screen bg-gray-50">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4">
            <TabsList className="h-14 bg-transparent border-none">
              <TabsTrigger 
                value="api-doc" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-3 font-medium"
              >
                <FileText className="w-4 h-4 mr-2" />
                Documentation API
              </TabsTrigger>
              <TabsTrigger 
                value="converter" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-3 font-medium"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Convertisseur Excel
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="api-doc" className="m-0">
          <ApiDocumentation />
        </TabsContent>
        
        <TabsContent value="converter" className="m-0">
          <ExcelToJsonConverter />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MainApp;
