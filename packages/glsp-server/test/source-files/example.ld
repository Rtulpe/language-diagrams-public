{
  "id": "392dfb27-66e2-42d8-ab9f-c2ccd2db096c",
  "nodes": [
    {
      "id": "8c7dfad9-1422-4e1b-9bd2-6d55468199b0",
      "name": "NewNode0",
      "fields": [
        {
          "id": "ee70551d-3e4f-4581-9fdb-bc6137779e6f",
          "name": "NewField",
          "type": "boolean"
        },
        {
          "id": "e0f586ab-2ebb-4af1-8fba-dd4024c23137",
          "name": "NewField",
          "type": "number"
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
          "id": "2413566b-f117-4ad1-9569-a05ae673903b",
          "name": "NewField",
          "type": "string"
        },
        {
          "id": "bfef05d4-f684-4051-9008-0c19e15dfdaa",
          "name": "NewField",
          "type": "boolean"
        }
      ],
      "validations": [
        "when true ensure (2 < 3) otherwise {}",
        "ensure (2 < (3 * 4)) otherwise {}"
      ],
      "position": {
        "x": 876,
        "y": 215
      },
      "size": {
        "width": 100,
        "height": 100
      }
    }
  ],
  "associations": [
    {
      "id": "969fffd5-a36a-4896-95ed-8e8dba3d0610",
      "name": "NewAssociation0",
      "source_id": "4c20e6b3-4967-40f8-9662-b5735d5ae62d",
      "target_id": "8c7dfad9-1422-4e1b-9bd2-6d55468199b0"
    }
  ]
}