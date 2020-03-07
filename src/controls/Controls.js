import React from "react";
import styled from "styled-components";
import { saveAs } from "file-saver";
import "@material/button/dist/mdc.button.css";
import { Button } from "@rmwc/button";
// comps
import SliderControl from "./sliderControl/SliderControl";
import { SwitchControl } from "./switchControl/SwitchControl";
import ColourPicker from "../components/colourPicker/ColourPicker";
import { TabsControl } from "./tabsControl/TabsControl";

const Controls = ({ appData, onUpdate, wrap = false }) => {
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);
  const { settings } = appData;

  const updateSettings = (key, newValue) => {
    onUpdate({ ...appData, [key]: newValue });
  };

  const settingsKeys = Object.keys(settings);
  const onSaveSvgClick = ({ name = "tiles-art", svgClass = "mainSVG" }) => {
    let full_svg = document.getElementsByClassName(svgClass)[0].outerHTML;
    full_svg = full_svg.split(">").join(`>`);

    var blob = new Blob([full_svg], { type: "image/svg+xml" });
    saveAs(blob, `artfly-${name}.svg`);
  };

  return (
    <Container>
      <TabsControl
        activeTabIndex={activeTabIndex}
        setActiveTabIndex={setActiveTabIndex}
      />

      <Instruction>-- tap pic to regenerate! --</Instruction>

      {activeTabIndex === 0 && (
        <ControlsUI wrapControls={wrap}>Hello</ControlsUI>
      )}

      {activeTabIndex === 1 && (
        <ControlsUI wrapControls={wrap}>
          <ButtHolder>
            <Button label="Save SVG" raised onClick={onSaveSvgClick} />
          </ButtHolder>

          {settingsKeys.map(key => {
            const currSetting = settings[key];
            const currValue = appData[key];

            if (currSetting.type === "colour") {
              return (
                <ColourPicker
                  key={key}
                  label={currSetting.label}
                  value={currValue}
                  onChange={value => updateSettings(key, value)}
                />
              );
            }

            if (currSetting.type === "boolean") {
              return (
                <SwitchControl
                  key={key}
                  label={currSetting.label}
                  value={currValue}
                  onChange={value => updateSettings(key, value)}
                />
              );
            }

            if (currSetting.type === "range") {
              return (
                <SliderControl
                  key={key}
                  labelStyle={{ minWidth: 150 }}
                  label={currSetting.label}
                  displayValue={true}
                  min={currSetting.min}
                  max={currSetting.max}
                  value={currValue}
                  step={currSetting.step}
                  onChange={value => updateSettings(key, value)}
                />
              );
            }

            return null;
          })}
        </ControlsUI>
      )}
    </Container>
  );
};

export default Controls;

// STYLES
const Container = styled.div`
  padding-top: 5px;
  color: white;
`;

const ControlsUI = styled.div`
  margin: 15px;
  display: ${props => (props.wrapControls ? "flex" : "")};
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
`;

const ButtHolder = styled.div`
  margin: 5px;
`;

const Instruction = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
`;
