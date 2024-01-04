{
  "id": "392dfb27-66e2-42d8-ab9f-c2ccd2db096c",
  "nodes": [
    {
      "id": "8c7dfad9-1422-4e1b-9bd2-6d55468199b0",
      "name": "NewNode0",
      "fields": [
        {
          "id": "02695b18-91c4-4b16-952a-b7c57f6dbaf5",
          "name": "NumberField0",
          "type": "number"
        },
        {
          "id": "6ae76891-5c50-4c3a-8ec7-7b35aea05bf7",
          "name": "StringField1",
          "type": "string"
        },
        {
          "id": "1b7aec2f-dad6-4b57-b55f-3b2ef8683127",
          "name": "BooleanField0",
          "type": "boolean"
        }
      ],
      "validations": [
        "ensure true otherwise {}"
      ],
      "position": {
        "x": 408,
        "y": 181
      },
      "size": {
        "width": 100,
        "height": 100
      }
    },
    {
      "id": "4c20e6b3-4967-40f8-9662-b5735d5ae62d",
      "name": "NewNode4",
      "fields": [
        {
          "id": "93f0ca68-163f-40c8-9aa6-d8847be75896",
          "name": "NumberField1",
          "type": "number"
        },
        {
          "id": "18139ff0-5797-4087-82cd-5300b7968a33",
          "name": "BooleanField1",
          "type": "boolean"
        }
      ],
      "validations": [
        "when true ensure (2 < 3) otherwise {}",
        "ensure (2 < (3 * 4)) otherwise {}"
      ],
      "position": {
        "x": 971,
        "y": 201
      },
      "size": {
        "width": 100,
        "height": 100
      }
    },
    {
      "id": "ef03095c-a80e-49fc-ac1d-2ebd68e3d94a",
      "name": "NewNode2",
      "fields": [
        {
          "id": "77e41e28-9c82-4792-94f3-8baf7132bc9b",
          "name": "NumberField2",
          "type": "number"
        },
        {
          "id": "bcedb87b-4174-4d69-b86e-9ce698e65055",
          "name": "BooleanField2",
          "type": "boolean"
        }
      ],
      "validations": [
        "Test"
      ],
      "position": {
        "x": 500,
        "y": 591
      }
    },
    {
      "id": "33146b42-636a-4a50-bd82-36054e2a85e1",
      "name": "NewNode3",
      "fields": [
        {
          "id": "1a459a91-c62a-43a7-b7ee-4801cd892c9a",
          "name": "StringField1",
          "type": "string"
        }
      ],
      "validations": [
        "Test"
      ],
      "position": {
        "x": 1035,
        "y": 573
      }
    }
  ],
  "associations": [
    {
      "id": "50835525-c0ca-4da9-aa94-ae910698c486",
      "name": "NewAssociation0",
      "source_id": "4c20e6b3-4967-40f8-9662-b5735d5ae62d",
      "target_id": "33146b42-636a-4a50-bd82-36054e2a85e1"
    },
    {
      "id": "1fed2633-0044-4e84-87b4-c18fd95e7139",
      "name": "NewAssociation1",
      "source_id": "33146b42-636a-4a50-bd82-36054e2a85e1",
      "target_id": "ef03095c-a80e-49fc-ac1d-2ebd68e3d94a"
    },
    {
      "id": "e0eaff4b-00f2-4365-a14f-a1505a8874fa",
      "name": "NewAssociation2",
      "source_id": "ef03095c-a80e-49fc-ac1d-2ebd68e3d94a",
      "target_id": "8c7dfad9-1422-4e1b-9bd2-6d55468199b0"
    },
    {
      "id": "e036098c-30ca-45a0-9896-f7a5d12ce377",
      "name": "NewAssociation3",
      "source_id": "8c7dfad9-1422-4e1b-9bd2-6d55468199b0",
      "target_id": "4c20e6b3-4967-40f8-9662-b5735d5ae62d"
    }
  ]
}