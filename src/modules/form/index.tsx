import { useRef, useState } from 'react';
import { Button, Switch, Group, TextInput, Textarea, NativeSelect } from '@mantine/core';
import { useForm } from '@mantine/form';

// import aesjs from 'aes-js';
import * as aesjs from 'aes-js'; 

const alphabet = [
    'A', 'B', 'C', 'D', 'E', 'F',
    'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z'
];

const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']

const numeralMap = {
    'I': 1,
    'II': 2,
    'III': 3,
    'IV': 4,
    'V': 5,
    'VI': 6,
    'VII': 7,
    'VIII': 8,
};

const initialValues = {
    ROTOR1: "VI",
    ROTOR2: "I",
    ROTOR3: "III",
    POSITION1: "A",
    POSITION2: "Q",
    POSITION3: "L",
    RING1: "A",
    RING2: "A",
    RING3: "A",
    PLUGBOARD: "bq cr di ej kw mt os px uz gh"
};

const toBytes = (text) => {
    return aesjs.utils.utf8.toBytes(text);
}

const keyFromFormData = (d) => {
    const plugboard = d.PLUGBOARD.split(' ').join('')
    let protoKey = `${numeralMap[d.ROTOR1]}${numeralMap[d.ROTOR2]}${numeralMap[d.ROTOR3]}${d.POSITION1}${d.POSITION2}${d.POSITION3}${d.RING1}${d.RING2}${d.RING3}${plugboard}===`;

    console.log(protoKey)

    const textBytes = toBytes(protoKey);

    return textBytes;
    // aesjs.utils.utf8.toBytes
}

const encryptAES = (key, plaintext) => {
        // encrypt
        const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        const textBytes = toBytes(plaintext);
        const encryptedBytes = aesCtr.encrypt(textBytes);
        return aesjs.utils.hex.fromBytes(encryptedBytes);
}


const decryptAES = (key, ciphertext) => {
    const hexBytes = aesjs.utils.hex.toBytes(ciphertext);
    const aesCtr1 = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    const decryptedBytes = aesCtr1.decrypt(hexBytes);
 
    // Convert our bytes back into text
    return aesjs.utils.utf8.fromBytes(decryptedBytes);
}


const onSubmit = (values, encryptIftrue,) => {
    const key = keyFromFormData(values);
    let text;
    if(encryptIftrue) {
        text = encryptAES(key, values.TEXT);
    } else {
        text =  decryptAES(key, values.TEXT);
    }
    return text;
}

export function Form() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues,
  });

  const [checked, setChecked] = useState(true);
  const [resultText, setResultText] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  return (
    <form onSubmit={form.onSubmit((values)=> {
        const result = onSubmit(values, checked)
        setResultText(result);
    })}>
        <Group>
            <NativeSelect key={form.key("ROTOR1")} {...form.getInputProps('ROTOR1')} label="ROTOR 1" data={romanNumerals} />
            <NativeSelect key={form.key("POSITION1")} {...form.getInputProps('POSITION1')} label="POSITION 1" data={alphabet} />
            <NativeSelect key={form.key("RING1")} {...form.getInputProps('RING1')} label="RING 1" data={alphabet} />

        </Group>

        <Group>
            <NativeSelect key={form.key("ROTOR2")} {...form.getInputProps('ROTOR2')} label="ROTOR 2" data={romanNumerals} />
            <NativeSelect key={form.key("POSITION2")} {...form.getInputProps('POSITION2')} label="POSITION 2" data={alphabet} />
            <NativeSelect key={form.key("RING2")} {...form.getInputProps('RING2')} label="RING 2" data={alphabet} />

        </Group>
        <Group>
            <NativeSelect key={form.key("ROTOR3")} {...form.getInputProps('ROTOR3')} label="ROTOR 3" data={romanNumerals} />
            <NativeSelect key={form.key("POSITION3")} {...form.getInputProps('POSITION3')} label="POSITION 3" data={alphabet} />
            <NativeSelect key={form.key("RING3")} {...form.getInputProps('RING3')} label="RING 3" data={alphabet} />
        </Group>
        <Group>
            <TextInput
                label={'PLUGBOARD'}
                key={form.key("PLUGBOARD")}
                {...form.getInputProps('PLUGBOARD')}
            />
        </Group>
    <Switch
      checked={checked}
      label={checked? "encrypt" : "decrypt"}
      onChange={(event) => setChecked(event.currentTarget.checked)}
    />

    <Textarea
      label="Text: "
        ref={ref}
      placeholder="Paste your ciphertext or plaintext here"
    />
    {!resultText ? null :
    <Textarea
    label="Result: "
    value={resultText}
  />
    }

    <Group justify="flex-end" mt="md">
        {/* <Button type="submit">Decrypt</Button> */}
        <Button type="submit">{checked? "encrypt" : "decrypt"}</Button>

    </Group>
    </form>
  );
}