import { Tabs, TabList, TabPanels, TabPanel, Tab } from "@chakra-ui/react";
import EditorEditBannerPanel from "./EditorEditBannerPanel";
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
                    <EditorEditBannerPanel />
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};

export default EditorEditPanel;
