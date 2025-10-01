from markov import MarkovChain

def train_and_save_model(input_file, output_file, order=3):
    with open(input_file, 'r', encoding='utf-8') as f:
        text = f.read()
    model = MarkovChain(order=order)
    model.train(text)
    model.save_model(output_file)
    print(f"Model trained and saved to {output_file}")
    return model