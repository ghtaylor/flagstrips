import { Tabs, TabList, TabPanels, TabPanel, Tab } from "@chakra-ui/react";
import EditorEditFlagPanel from "./EditorEditFlagPanel";
import EditorEditStripPanel from "./EditorEditStripPanel";

const EditorEditPanel: React.FC = () => {
    return (
        <Tabs variant="soft-rounded" colorScheme="green" size="sm">
            <TabList marginBottom={3}>
                <Tab>strip</Tab>
                <Tab>banner</Tab>
            </TabList>
            <TabPanels>
                <TabPanel padding={0}>
                    <EditorEditStripPanel />
                </TabPanel>
                <TabPanel padding={0}>
                    <EditorEditFlagPanel />
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};

export default EditorEditPanel;
