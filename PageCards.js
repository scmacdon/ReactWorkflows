import React, { useState, useEffect } from 'react';
import Cards from "@cloudscape-design/components/cards";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import TextFilter from "@cloudscape-design/components/text-filter";
import Header from "@cloudscape-design/components/header";
import Pagination from "@cloudscape-design/components/pagination";
import CollectionPreferences from "@cloudscape-design/components/collection-preferences";
import Link from "@cloudscape-design/components/link";
import './styles.css';

const PageCards = () => {
  const [selectedItems, setSelectedItems] = React.useState([{ name: "Item 2" }]);

  return (
    <Cards
      onSelectionChange={({ detail }) =>
        setSelectedItems(detail?.selectedItems ?? [])
      }
      selectedItems={selectedItems}
      ariaLabels={{
        itemSelectionLabel: (e, t) => `select ${t.name}`,
        selectionGroupLabel: "Item selection"
      }}
      cardDefinition={{
        header: item => (
          <Link href="#" fontSize="heading-m">
            {item.name}
          </Link>
        ),
        sections: [
          {
            id: "description",
            header: "Description",
            content: item => item.description
          },
          {
            id: "type",
            header: "Type",
            content: item => item.type
          },
          {
            id: "size",
            header: "Size",
            content: item => item.size
          }
        ]
      }}
      cardsPerRow={[
        { cards: 3 }
      ]}
      items={[
        {
          name: "Scott Macdonald",
          alt: "First",
          description: "Scott Macdonald Goals as of 3/6/2024",
          type: "3 scouts",
          size: "5 follows"
        },
        {
            name: "Jason Quesenberry",
            alt: "First",
            description: "Jason Quesenberry Goals as of 3/6/2024",
            type: "2 scouts",
            size: "4 follows"
        },
        {
          name: "Item 3",
          alt: "Third",
          description: "This is the third item",
          type: "1A",
          size: "Large"
        },
        {
          name: "Item 4",
          alt: "Fourth",
          description: "This is the fourth item",
          type: "2A",
          size: "Small"
        },
        {
          name: "Item 5",
          alt: "Fifth",
          description: "This is the fifth item",
          type: "2A",
          size: "Large"
        },
        {
          name: "Item 6",
          alt: "Sixth",
          description: "This is the sixth item",
          type: "1A",
          size: "Small"
        }
      ]}
      loadingText="Loading resources"
      selectionType="multi"
      trackBy="name"
      visibleSections={["description", "type", "size"]}
      empty={
        <Box
          margin={{ vertical: "xs" }}
          textAlign="center"
          color="inherit"
        >
          <SpaceBetween size="m">
            <b>No resources</b>
            <Button>Create resource</Button>
          </SpaceBetween>
        </Box>
      }
      filter={
        <TextFilter filteringPlaceholder="Find resources" />
      }
      header={
        <Header
          counter={
            selectedItems?.length
              ? "(" + selectedItems.length + "/10)"
              : "(10)"
          }
        >
          Common cards with selection
        </Header>
      }
      pagination={
        <Pagination currentPageIndex={1} pagesCount={2} />
      }
      preferences={
        <CollectionPreferences
          title="Preferences"
          confirmLabel="Confirm"
          cancelLabel="Cancel"
          preferences={{
            pageSize: 6,
            visibleContent: [
              "description",
              "type",
              "size"
            ]
          }}
          pageSizePreference={{
            title: "Page size",
            options: [
              { value: 6, label: "6 resources" },
              { value: 12, label: "12 resources" }
            ]
          }}
          visibleContentPreference={{
            title: "Select visible content",
            options: [
              {
                label: "Main distribution properties",
                options: [
                  {
                    id: "description",
                    label: "Description"
                  },
                  { id: "type", label: "Type" },
                  { id: "size", label: "Size" }
                ]
              }
            ]
          }}
        />
      }
    />
  );
}

export default PageCards;

