import { CURRENCIES } from "../common/globals.js"

let autoValues = [];
for (let key in CURRENCIES) {
  autoValues.push( {
    "key": key,
    "name": CURRENCIES[key],
  } );
}

function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Crypto Currency Market</Text>}>
        <Select
          label={"UPDATE INTERVAL"}
          settingsKey="update_interval_setting"
          options={[
            {name:"None", value:"0"},
            {name:"1 min", value:"60000"},
            {name:"3 min", value:"180000"},
            {name:"5 min", value:"300000"},
            {name:"10 min", value:"600000"},
          ]}
        />
        <AdditiveList
          title="Add your favorite currencies"
          settingsKey="favorite_currency_setting"
          maxItems="5"
          addAction={
            <TextInput
              title="Add currency"
              label="Name"
              placeholder="Type currency short name"
              action="Add Currency"
              onAutocomplete={(value) => {
                return autoValues.filter((option) =>
                  option.name.toLowerCase().includes(value.toLowerCase()));
              }}
            />
          }
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
